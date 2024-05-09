import React, {useState} from 'react';
import {MdPreview, ModalToolbar} from 'md-editor-rt';
import preview from '../../public/preview.png'
import {useTranslation} from 'react-i18next';

interface ReadExtensionProp {
    mdText: string;
    trigger?:any;
}


const readingHeadingId = (_text: string, _level: number, index: number) => {
    return `read-ex-heading-${index}`;
};

const ReadExtension = (props: ReadExtensionProp) => {
    const [state, setState] = useState({
        visible: false,
        modalFullscreen: false
    });

    const {t} = useTranslation();


    return (
        <ModalToolbar
            visible={state.visible}
            isFullscreen={state.modalFullscreen}
            showAdjust
            title={t('ylms')}
            modalTitle={t('ylms')}
            width="100%"
            height="100%"
            onClick={() => {
                setState({
                    ...state,
                    visible: true
                });
            }}
            onClose={() => {
                setState({
                    ...state,
                    visible: false
                });
            }}
            onAdjust={() => {
                setState({
                    ...state,
                    modalFullscreen: !state.modalFullscreen
                });
            }}
            trigger={
                <img src={preview} style={{width: '20px', height: '20px'}} alt={t('ylms')}/>
            }
        >
            <div
                style={{
                    height: '100%',
                    padding: '20px',
                    overflow: 'auto',
                    boxSizing: 'border-box'
                }}
            >
                <MdPreview
                    editorId="edit2preview"
                    modelValue={props.mdText?props.mdText:""}
                    mdHeadingId={readingHeadingId}
                />
            </div>
        </ModalToolbar>
    );
};

export default ReadExtension;
