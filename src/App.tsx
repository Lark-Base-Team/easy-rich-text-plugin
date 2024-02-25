import './App.css';
import {bitable} from "@lark-base-open/js-sdk";
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {MdEditor, ToolbarNames, config} from 'md-editor-rt';
import course from './public/course.png'
import 'md-editor-rt/lib/style.css';
import ReadExtension from './components/ReadExtension';
import {FilterXSS} from 'xss';

export default function App() {
    const xssFilter = new FilterXSS();
    // 表最大的概念
    const baseTable = bitable.base
    const {t} = useTranslation();
    // 具体text
    const [text, setText] = useState<string>('');
    const [showText, setShowText] = useState<boolean>(false);
    const [showHelp, setShowHelp] = useState<boolean>(true);
    const [nowtab, setNowtab] = useState<string>('base');
    const [nowFieldId, setNowFieldId] = useState<string>('');
    const [nowRecordId, setNowRecordId] = useState<string>('');
    const [toolbars] = useState<ToolbarNames[]>([
        'task',
        'codeRow',
        'code',
        'link',
        'image',
        'table',
        'mermaid',
        'katex',
        0,
        '=',
        'catalog',
    ]);
    config({
        editorConfig: {
            languageUserDefined: {
                'my-lang': {
                    toolbarTips: {
                        task: t('rw'),
                        codeRow: t('hndm'),
                        code: t('kjdm'),
                        link: t('lj'),
                        image: t('tp'),
                        table: 'table',
                        mermaid: 'mermaid',
                        katex: 'katex',
                        catalog: t('ml')
                    },
                    imgTitleItem: {
                        link: t('tjlj'),
                        upload: t('sctp'),
                        clip2upload: 'Crop upload'
                    },
                    linkModalTips: {
                        linkTitle: t('tjlj'),
                        imageTitle: t('tjtp'),
                        descLabel: t('ljms'),
                        descLabelPlaceHolder: t('psrms'),
                        urlLabel: t('ljdz'),
                        urlLabelPlaceHolder: t('qsrlj')
                    },
                    copyCode: {
                        text: 'copy',
                        successTips: 'ok！',
                        failTips: 'error！'
                    },
                    mermaid: {
                        flow: t('lct'),
                        sequence: t('sxg'),
                        gantt: t('gtt'),
                        class: t('lt'),
                        state: t('zt'),
                        pie: t('bt'),
                        relationship: t('gx'),
                        journey: t('ljt')
                    },
                    katex: {
                        inline: t('hxsgf'),
                        block: t('kkjgf')
                    },
                    footer: {
                        markdownTotal: t('zs'),
                        scrollAuto: t('tbgd')
                    }
                }
            }
        }
    });
    const [language] = useState('my-lang');

    // 选择数据
    useEffect(() => {
        baseTable.onSelectionChange(getSelectionData);
    }, [])

    //代码块复制
    const formatCopiedText = (text: string) => {
        return `${text}`;
    };

    /** 选中后得到的数据 */
    const getSelectionData = async (e: any) => {
        const cellValue = await (await baseTable.getTableById(e.data.tableId))
            .getCellString(e.data.fieldId, e.data.recordId) as string;
        setNowtab(e.data.tableId);
        setNowFieldId(e.data.fieldId);
        setNowRecordId(e.data.recordId);
        if (cellValue) {
            setText(cellValue);
            setShowText(true);
            setShowHelp(false);
        }
    }

    /**  写回单元格内 */
    const writeBack = async () => {
        if (!nowtab || !nowFieldId || !nowRecordId) return;
        const table = await baseTable.getTableById(nowtab)
        await table.setCellValue<string>(nowFieldId, nowRecordId, text);
    }
    //监听内容变化
    useEffect(() => {
        writeBack().then(() => {
        });
    }, [text])

    // 渲染
    return (
        <main className="main">
            <div className={'action-desc'}>
                <blockquote>
                    {t('desctitle')}
                </blockquote>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {/* 根据showHelp的值决定是否显示该句子 */}
                {showHelp && (
                    <div style={{textAlign: 'center'}}>
                        <br/>
                        <br/>
                        <img src={course} style={{width: '50%', height: '50%', opacity: 0.8}} alt={"欢迎使用"}/>
                        <h4>{t('tip')}</h4>
                    </div>
                )}

                {/* 其他组件内容... */}
            </div>
            {showText && (<div className={'show-text-div'}>
                <div className={'action-desc'}></div>
                <div className={'mian-text'}>
                    <div>{t('oktext')}:</div>
                    <MdEditor
                        language={language}
                        noUploadImg
                        preview={true}
                        modelValue={xssFilter.process(text)}
                        onChange={setText}
                        pageFullscreen={true}
                        onSave={writeBack}
                        toolbars={toolbars}
                        formatCopiedText={formatCopiedText}
                        defToolbars={[
                            <ReadExtension mdText={xssFilter.process(text)} key="read-extension"/>,
                        ]}
                    />
                </div>
            </div>)}

        </main>
    )
}
