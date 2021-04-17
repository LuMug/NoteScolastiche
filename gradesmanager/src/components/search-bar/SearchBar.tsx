import './search-bar.css';

interface ISearchBarProps {

    onChange?: (text: string) => void;

    placeholder?: string;
}

const SearchBar: React.FunctionComponent<ISearchBarProps> = (props) => {
    return <input
        type="text"
        className="sb-input"
        onChange={(e) => props.onChange ? props.onChange(e.target.value) : null}
        placeholder={props.placeholder ? props.placeholder : 'Cerca'} />
}

export default SearchBar;