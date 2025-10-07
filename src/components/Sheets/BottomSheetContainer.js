// components/Sheets/BottomSheetContainer.js
import React from 'react';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {mvs} from '../../util/metrices';

const BottomSheetContainer = React.forwardRef(
  ({index = -1, snapPoints, activeSheet, sheetKey, setActiveSheet, children, heightStyle}, ref) => {
    const renderBackdrop = props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        style={{backgroundColor: 'rgba(0,0,0,0.7)'}}
      />
    );

    return (
      <BottomSheet
        ref={ref}
        onChange={i => {
          if (i === -1 && activeSheet === sheetKey) setActiveSheet(null);
        }}
        index={index}
        snapPoints={snapPoints}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backdropComponent={renderBackdrop}
        detached={false}
        backgroundStyle={{backgroundColor: '#fff'}}
        handleStyle={{backgroundColor: '#fff'}}
        style={{borderRadius: mvs(30), overflow: 'hidden', ...heightStyle}}>
        {children}
      </BottomSheet>
    );
  },
);

export default BottomSheetContainer;
