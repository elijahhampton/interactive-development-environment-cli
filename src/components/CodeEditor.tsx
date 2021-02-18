import '../css/codeeditor/index.css';
import '../css/codeeditor/syntax.css';
import { useRef } from 'react';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import { CodeEditorProps } from '../interface/CodeEditor';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

const CodeEditor : React.FC<CodeEditorProps> = 
({
    initialValue,
    onChange
}) => {
    const monacoEditorRef = useRef<any>();
    
    const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
        monacoEditorRef.current = monacoEditor;
        
        /* Update input state whenever user types and content has changed */
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue());
        });

        monacoEditor.getModel()?.updateOptions({
            tabSize: 2
        });

        const highlighter = new Highlighter(
            // @ts-ignore
            window.monaco,
            codeShift,
            monacoEditor
        );

        highlighter.highLightOnDidChangeModelContent(
            () => {},
            () => {},
            undefined,
            () => {}
        );
    };

    const onFormatClick = () => {
        // get current value from editor
        const unformattedValue = monacoEditorRef.current.getModel().getValue();

        //format value
        const formattedValue = prettier.format(unformattedValue, {
            parser: 'babel',
            plugins: [parser],
            useTabs: false,
            semi: true,
            singleQuote: true,
        }).replace(/\n$/, '');



        //set the formatted value back in the editor
        monacoEditorRef.current.setValue(formattedValue);
    }

    return (
        <div className="editor-wrapper">
            <button className="button button-format is-primary is-small" onChange={onFormatClick}> Format </button>
    <MonacoEditor 
    editorDidMount={onEditorDidMount}
    value={initialValue}
    theme="light" 
    language="javascript" 
    height="500px" 
    options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        showUnused: false,
        folding: false,
        lineNumbersMinChars: 16,
        fontSize: 16,
        scrollBeyondLastLine: false,
    }}
    />
        </div>
    )
};

export default CodeEditor;