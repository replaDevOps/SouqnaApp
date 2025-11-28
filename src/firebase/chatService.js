// firebase/chatService.js
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  startAfter,
} from 'firebase/firestore';
import {db} from '.';
import {storeChatId} from '../api/apiServices';

// Create a new conversation or get existing one
export const getOrCreateConversation = async (
  currentUserId,
  otherUserId,
  token,
) => {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('members', 'array-contains', currentUserId),
    );

    const querySnapshot = await getDocs(q);

    let existingConversation = null;

    querySnapshot.forEach(doc => {
      const conversationData = doc.data();
      if (conversationData.members.includes(otherUserId)) {
        existingConversation = {id: doc.id, ...conversationData};
      }
    });

    if (existingConversation) {
      return existingConversation;
    }

    const newConversationRef = doc(conversationsRef);
    const newConversation = {
      members: [currentUserId, otherUserId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: {
        text: '',
        senderId: '',
        createdAt: serverTimestamp(),
      },
      userInfo: {
        [currentUserId]: {
          id: currentUserId,
          unreadCount: 0,
        },
        [otherUserId]: {
          id: otherUserId,
          unreadCount: 0,
        },
      },
    };

    await setDoc(newConversationRef, newConversation);

    await storeChatId(otherUserId, token);

    return {id: newConversationRef.id, ...newConversation};
  } catch (error) {
    console.error('[chatService] Error creating/getting conversation:', error);
    throw error;
  }
};

// Get all conversations for a user
export const getUserConversations = (userId, onResult, onError) => {
  const conversationsRef = collection(db, 'conversations');
  const q = query(
    conversationsRef,
    where('members', 'array-contains', userId),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    q,
    querySnapshot => {
      onResult(querySnapshot);
    },
    error => {
      console.error('[chatService] getUserConversations error:', error);
      onError(error);
    },
  );
};

// Send a message in a conversation
export const sendMessage = async (conversationId, message) => {
  try {
    if (!message.text || message.text.trim() === '') {
      return null;
    }

    const batch = writeBatch(db);

    const messagesRef = collection(
      db,
      `conversations/${conversationId}/messages`,
    );
    const newMessageRef = doc(messagesRef);

    batch.set(newMessageRef, {
      ...message,
      createdAt: serverTimestamp(),
    });

    const conversationRef = doc(db, 'conversations', conversationId);

    const lastMessageUpdate = {
      lastMessage: {
        text: message.text || '',
        senderId: message.user._id,
        createdAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
      [`userInfo.${message.user._id}.lastRead`]: serverTimestamp(),
    };

    batch.update(conversationRef, lastMessageUpdate);

    const conversationDoc = await getDoc(conversationRef);
    const conversationData = conversationDoc.data();

    if (!conversationData) {
      console.error(
        `[chatService] No conversation data found for ID: ${conversationId}`,
      );
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    conversationData.members.forEach(memberId => {
      if (memberId !== message.user._id) {
        const currentUnreadCount =
          conversationData.userInfo[memberId]?.unreadCount || 0;
        batch.update(conversationRef, {
          [`userInfo.${memberId}.unreadCount`]: currentUnreadCount + 1,
        });
      }
    });

    await batch.commit();
    return newMessageRef.id;
  } catch (error) {
    console.error('[chatService] Error sending message:', error);
    throw error;
  }
};

// Get messages for a conversation with pagination
export const getMessages = (
  conversationId,
  callback,
  lastVisibleDoc = null,
  messagesPerPage = 20,
) => {
  const messagesRef = collection(
    db,
    `conversations/${conversationId}/messages`,
  );
  let q;

  if (lastVisibleDoc) {
    q = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      startAfter(lastVisibleDoc),
      limit(messagesPerPage),
    );
  } else {
    q = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(messagesPerPage),
    );
  }

  return onSnapshot(q, callback);
};

export const markConversationAsRead = async (conversationId, userId) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    const updateData = {
      [`userInfo.${userId}.unreadCount`]: 0,
    };

    await updateDoc(conversationRef, updateData);
    return true;
  } catch (error) {
    console.error('[chatService] Error marking conversation as read:', error);
    return false;
  }
};

// Get user info for displaying in chat
export const getUserInfo = async userId => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('[chatService] Error getting user info:', error);
    throw error;
  }
};
