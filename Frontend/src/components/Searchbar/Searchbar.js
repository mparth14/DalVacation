import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import './Searchbar.css';

const Searchbar = ({ startDate, setStartDate, endDate, setEndDate, onSearch }) => {

    return (
        <div className="container mt-3">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="searchbar-container p-3">

                        <div className="search-date mb-3 mb-md-0">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                placeholderText="Pick a start date .."
                            />
                        </div>

                        <div className="search-date mb-3 mb-md-0">
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholderText="Pick an end date .."
                            />
                        </div>
                        <button className="btn search-button" onClick={onSearch}>
                            <SearchTwoToneIcon sx={{ fontSize: 30 }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Searchbar;
