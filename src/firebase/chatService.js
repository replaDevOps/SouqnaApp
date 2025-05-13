// firebase/chatService.js
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
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
  startAfter
} from 'firebase/firestore';
import { db } from '.';

// Create a new conversation or get existing one
export const getOrCreateConversation = async (currentUserId, otherUserId, token) => {
  try {
    // Check if conversation already exists
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('members', 'array-contains', currentUserId)
    );
    
    const querySnapshot = await getDocs(q);
    let existingConversation = null;
    
    querySnapshot.forEach((doc) => {
      const conversationData = doc.data();
      if (conversationData.members.includes(otherUserId)) {
        existingConversation = { id: doc.id, ...conversationData };
      }
    });
    
    if (existingConversation) {
      return existingConversation;
    }
    
    // Create new conversation if it doesn't exist
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
        }
      }
    };
    
    await setDoc(newConversationRef, newConversation);
    return { id: newConversationRef.id, ...newConversation };
  } catch (error) {
    console.error('Error creating/getting conversation:', error);
    throw error;
  }
};

// Get all conversations for a user
export const getUserConversations = (userId, onResult, onError) => {
  const conversationsRef = collection(db, 'conversations');
  const q = query(
    conversationsRef,
    where('members', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  
  return onSnapshot(q, onResult, onError);
};

// Send a message in a conversation
export const sendMessage = async (conversationId, message) => {
  try {
    const batch = writeBatch(db);
    
    // Add the message to subcollection
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const newMessageRef = doc(messagesRef);
    
    batch.set(newMessageRef, {
      ...message,
      createdAt: serverTimestamp(),
    });
    
    // Update conversation metadata
    const conversationRef = doc(db, 'conversations', conversationId);
    batch.update(conversationRef, {
      lastMessage: {
        text: message.text || '📎 Attachment',
        senderId: message.user._id,
        createdAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
      [`userInfo.${message.user._id}.lastRead`]: serverTimestamp(),
    });
    
    // Increment unread counter for other users in conversation
    const conversationDoc = await getDoc(conversationRef);
    const conversationData = conversationDoc.data();
    
    conversationData.members.forEach(memberId => {
      if (memberId !== message.user._id) {
        batch.update(conversationRef, {
          [`userInfo.${memberId}.unreadCount`]: (conversationData.userInfo[memberId]?.unreadCount || 0) + 1
        });
      }
    });
    
    // Commit the batch
    await batch.commit();
    
    return newMessageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages for a conversation with pagination
export const getMessages = (conversationId, callback, lastVisibleDoc = null, messagesPerPage = 20) => {
  const messagesRef = collection(db, `conversations/${conversationId}/messages`);
  let q;
  
  if (lastVisibleDoc) {
    // Make sure we're passing a proper document snapshot
    q = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      startAfter(lastVisibleDoc),
      limit(messagesPerPage)
    );
  } else {
    q = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(messagesPerPage)
    );
  }
  
  return onSnapshot(q, callback);
};

export const markConversationAsRead = async (conversationId, userId) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    
    // Create an update object that sets the unread count to 0 for this user
    const updateData = {
      [`userInfo.${userId}.unreadCount`]: 0
    };
    
    await updateDoc(conversationRef, updateData);
    return true;
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    return false;
  }
};

// Get user info for displaying in chat
export const getUserInfo = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log('No such user!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};