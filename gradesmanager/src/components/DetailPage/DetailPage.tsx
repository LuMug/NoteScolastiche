import OptionButton from '../option-button/OptionButtons';
import './DetailPage.css';


function DetailPage() {
    return (
        <div className="dp-main-content">$
            <div>
             {/* big avg*/}
             {/* matter*/}
             {/* Teacher*/}   
             {/* Test nr and avg*/}
            </div>
            <div className="dp-buttons-content">
                <OptionButton />
            </div>
            <div>
                <input type="text" placeholder="🔍 Filtra" className="filter-text" />
            </div>
        </div>
    );
}

export default DetailPage;
