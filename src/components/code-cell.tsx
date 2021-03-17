import { useState, useEffect } from 'react';

import CodeEditor from '../components/code-editor';
import Preview from '../components/preview';
import bundle from '../bundler';
import Resizable from './resizable';
import { useActions } from '../hooks/use-actions';
import { Cell } from '../state';

interface CodeCellProps {
    cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
    const [code, setCode] = useState('');
    const [err, setErr] = useState('');
    const [input, setInput] = useState('');

    const { updateCell } = useActions();

    useEffect(() => {
        const timer = setTimeout(async () => {
            const output = await bundle(cell.content);
            setCode(output.code);
            setErr(output.err);
        }, 1000);

        return () => {
            // clear running time when user inputs code
            clearTimeout(timer);
        };
    }, [cell.content]);

    return (
        <Resizable direction="vertical">
            <div
                style={{
                    height: 'calc(100% - 10px)',
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <Resizable direction="horizontal">
                    <CodeEditor
                        initialValue={cell.content}
                        onChange={(value) => updateCell(cell.id, value)}
                    />
                </Resizable>
                <Preview code={code} bundlingStatus={err} />
            </div>
        </Resizable>
    );
};

export default CodeCell;
