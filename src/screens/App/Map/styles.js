import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { mvs } from '../../../util/metrices';
import { colors } from '../../../util/color';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    BottomContainer: {
        borderTopColor: colors.grey,
        borderTopWidth: 1,
        position: 'absolute',
        padding: mvs(8),
        bottom: 0,
        backgroundColor: '#fff',
        width: '100%',
        zIndex: 50,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    myLocationButton: {
        position: 'absolute',
        Top: mvs(40),
        right: mvs(7),
        backgroundColor: colors.white,
        width: mvs(48),
        height: mvs(48),
        borderRadius: mvs(24),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    loadingIndicator: {
        position: 'absolute',
        width: mvs(48),
        height: mvs(48),
        borderRadius: mvs(24),
        borderWidth: 2,
        borderColor: colors.primary,
        borderTopColor: 'transparent',
        backgroundColor: 'transparent',
        transform: [{ rotate: '45deg' }],
        opacity: 0.7,
    }, productDetailContainer: {
        
        backgroundColor: colors.white,
        // borderRadius: mvs(10),
        flexDirection: 'row',
        paddingVertical: mvs(5),
        paddingHorizontal: mvs(5),
       
       
    },
    productImageContainer: {
        width: mvs(80),
        height: mvs(80),
        borderRadius: mvs(8),
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    noImagePlaceholder: {
        backgroundColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
        marginLeft: mvs(10),
        justifyContent: 'space-between',
    },
    productTitle: {
        fontSize: mvs(16),
        fontWeight: 'bold',
        color: colors.black,
    },
    productLocation: {
        fontSize: mvs(14),
        color: colors.darkGrey,
    },
    priceTagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceTag: {
        fontSize: mvs(18),
        fontWeight: 'bold',
        color: colors.primary,
    },
    conditionTag: {
        fontSize: mvs(12),
        color: colors.darkGrey,
        backgroundColor: colors.lightGrey,
        paddingHorizontal: mvs(6),
        paddingVertical: mvs(2),
        borderRadius: mvs(4),
    },
    closeButton: {
        position: 'absolute',
        top: mvs(5),
        right: mvs(5),
        width: mvs(24),
        height: mvs(24),
        borderRadius: mvs(12),
        backgroundColor: colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: mvs(16),
        fontWeight: 'bold',
        color: colors.darkGrey,
    },
    calloutContainer: {
        width: 200,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    calloutPrice: {
        color: 'green',
        fontWeight: '500',
        fontSize: 12,
        marginBottom: 4,
    },
    calloutDescription: {
        fontSize: 12,
        color: '#666',
    },
});

export default styles;