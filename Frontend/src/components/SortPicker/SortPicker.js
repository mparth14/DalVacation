import React, { useState } from 'react';
import './SortPicker.css';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Popover, FormControlLabel, RadioGroup, Radio, Button } from '@mui/material';


const SortPicker = ({ selectedOption, onSortChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSortChange = (event) => {
        onSortChange(event.target.value);
        handleClose();
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'sort-options-popover' : undefined;

    return (
        <div className="sort-container">
            <Button className="sort-selected-option" onClick={handleClick} style={{ color: 'black' }}>
                {selectedOption}
                <ExpandMoreOutlinedIcon />
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div className="sort-options" style={{ padding: '10px' }}>
                    <RadioGroup
                        aria-label="sort-options"
                        name="sort"
                        value={selectedOption}
                        onChange={handleSortChange}

                    >
                        {['Lowest price first', 'Highest price first'].map(option => (
                            <FormControlLabel
                                key={option}
                                value={option}
                                control={<Radio style={{ color: '#ff6f61' }} />}
                                label={option}
                            />
                        ))}
                    </RadioGroup>
                </div>
            </Popover>
        </div>
    );
};

export default SortPicker;
