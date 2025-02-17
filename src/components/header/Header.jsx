import React, { useState } from 'react'
import "./header.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBed, faCalendarDays, faCar, faPerson, faPlane, faTaxi } from '@fortawesome/free-solid-svg-icons'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from 'date-fns';

const Header = () => {
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [openDate, setOpenDate] = useState(false);
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1
    });

    const [openOptions, setOpenOptions] = useState(false);

    const handleOptions = (type, action) => {
        return () => {
            if (action === "i") {
                setOptions({ ...options, [type]: options[type] + 1 })
            } else if (action === "d") {
                setOptions({ ...options, [type]: options[type] - 1 })
            }
        }
    }

    return (
        <div className='header'>
            <div className="headerContainer">
                <div className="headerList">
                    <div className="headerListItem active">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Stays</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faPlane} />
                        <span>Flights</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faCar} />
                        <span>Cars rentals</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Attractions</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faTaxi} />
                        <span>Airports and Taxis</span>
                    </div>
                </div>
                <h1 className="headerTitle">Tìm chỗ nghỉ tiếp theo</h1>
                <p className="headerDesc">Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa,...</p>
                <button className="headerBtn">Sign in / Register</button>
                <div className="headerSearchBar">
                    <div className="searchItem">
                        <FontAwesomeIcon icon={faBed} className='headerIcon' />
                        <input
                            type="text"
                            className="searchInput"
                            placeholder='Bạn muốn đến đâu?'
                        />
                    </div>
                    <div className="searchItem" onClick={() => setOpenDate(!openDate)}>
                        <FontAwesomeIcon icon={faCalendarDays} className='headerIcon' />
                        <span className='searchText'>
                            {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(date[0].endDate, "MM/dd/yyy")}`}
                        </span>
                        {openDate && <DateRange
                            editableDateInputs={true}
                            onChange={item => setDate([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={date}
                            className='date'
                        />}
                    </div>
                    <div className="searchItem">
                        <FontAwesomeIcon icon={faPerson} className='headerIcon' />
                        <span
                            className='searchText'
                            onClick={() => setOpenOptions(!openOptions)}
                        >
                            {`${options.adult} adult - ${options.children} children - ${options.room} room`}
                        </span>
                        {
                            openOptions
                            &&
                            <div className="optionsContainer">
                                <div className="optionItem">
                                    <span className='optionText'>Người lớn</span>

                                    <div className="optionCounter">
                                        <button
                                            className="optionCounterBtn"
                                            onClick={handleOptions("adult", "d")}
                                            disabled={options.adult <= 1}

                                        >-</button>
                                        <span className="optionCounterNumber">{options.adult}</span>
                                        <button
                                            className="optionCounterBtn"
                                            onClick={handleOptions("adult", "i")}

                                        >+</button>
                                    </div>
                                </div>
                                <div className="optionItem">
                                    <span className='optionText'>Trẻ em</span>

                                    <div className="optionCounter">
                                        <button
                                            onClick={handleOptions("children", "d")}
                                            className="optionCounterBtn"
                                            disabled={options.children <= 1}
                                        >-</button>
                                        <span className="optionCounterNumber">{options.children}</span>
                                        <button onClick={handleOptions("children", "i")} className="optionCounterBtn">+</button>
                                    </div>
                                </div>
                                <div className="optionItem">
                                    <span className='optionText'>Phòng</span>

                                    <div className="optionCounter">
                                        <button
                                            className="optionCounterBtn"
                                            onClick={handleOptions("room", "d")}
                                            disabled={options.room <= 1}
                                        >-</button>
                                        <span className="optionCounterNumber">{options.room}</span>
                                        <button
                                            className="optionCounterBtn"
                                            onClick={handleOptions("room", "i")}
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="searchItem">
                        <button className="headerBtn">Tìm</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header