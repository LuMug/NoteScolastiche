import { useState } from 'react';
import './search-bar.css';

interface ISearchBarProps {

    onChange?: (text: string) => void;

    placeholder?: string;
}

const SearchBar: React.FunctionComponent<ISearchBarProps> = (props) => {
    const [text, setText] = useState('');

    return <div className="sb-main-content">
        <input
            type="text"
            className="sb-input"
            onChange={e => {
                setText(e.target.value);
                return props.onChange ? props.onChange(e.target.value) : null
            }}
            placeholder={props.placeholder ? props.placeholder : 'Cerca'}
            pattern="a"
            value={text} />
        <div className="sb-clear" onClick={() => {
            setText('');
            return props.onChange ? props.onChange('') : null
        }}></div>
    </div>

}

export default SearchBar;