import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { METHODS } from "../../../services/api";
import star from "../../../asset/ratingIcon.svg";
// import moment from "moment";
import { format } from "../../../common/date";
import "./styles.scss";

import { useDebounce } from "use-debounce";
import ReactPaginate from "react-paginate";
import { BsArrowUpDown } from "react-icons/bs";
// import useStyles from "./styles";
// import { breakpoints } from "../../theme/constant";
import InputAdornment from "@mui/material/InputAdornment";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Container,
  TextField,
  Typography,
  Grid,
  Divider,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  // TableRow
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box, display, fontSize } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function VolunteerDashboard() {
  const limit = 10;
  const [volunteer, setVolunteer] = useState([]);
  const [selctedPathway, setSelectedPathway] = useState("");
  const [cacheVolunteer, setCacheVolunteer] = useState([]);
  const [slicedVolunteer, setSlicedVolunteer] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [sortMethod, setSortMethod] = useState("dsc");
  const [debouncedText] = useDebounce(searchTerm);
  const [language, setLangue] = useState("All");
  const [week, setWeek] = useState("All");
  const [rating, setRating] = useState("All");

  let pageCount = Math.ceil(volunteer && volunteer.length / limit);

  if (selctedPathway) {
    pageCount = Math.ceil(slicedVolunteer && slicedVolunteer.length / limit);
  }

  const [dropdowns, setDropdowns] = useState({
    duration: false,
    language: false,
    rating: false,
  });

  const user = useSelector(({ User }) => User);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDropdown = (e) => (key) => {
    setDropdowns({ ...dropdowns, [key]: !dropdowns[key] });
  };

  useEffect(() => {
    axios({
      method: METHODS.GET,
      url: `${process.env.REACT_APP_MERAKI_URL}/volunteers`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
    }).then((res) => {
      setVolunteer(res.data);
      setCacheVolunteer(res.data);
      setSlicedVolunteer(
        res.data.slice(pageNumber * limit, (pageNumber + 1) * limit)
      );
      pageCount = Math.ceil(slicedVolunteer && slicedVolunteer.length / limit);
    });
  }, []);

  const languageMap = {
    hi: "Hindi",
    te: "Telugu",
    en: "English",
    ta: "Tamil",
  };

  function filterPathway(pathway, volunteer) {
    return volunteer.filter((el) => {
      for (let i of el.pathways) {
        if (i === pathway) {
          return true;
        }
      }
    });
  }

  function filterweek(language, rating) {
    language("All");
    rating("All");
    let date = Date.now();
    return cacheVolunteer.filter((el) => {
      const classes = el.classes;
      const cur_date =
        classes.length && new Date(classes[classes.length - 1].end_time);
      if (week === "All") {
        return true;
      }
      if (cur_date >= date - week * 7 * 24 * 60 * 60 * 1000) {
        return true;
      }
    });
  }

  function ratings(week, language) {
    week("All");
    language("All");
    return cacheVolunteer.filter(
      (el) => rating === "All" || rating == el.avg_rating
    );
  }

  function numberOfWeek(el) {
    const classes = el.classes;
    let last_date =
      classes.length && new Date(classes[classes.length - 1].end_time);
    let new_date = classes.length && new Date(el.classes[0].end_time);
    return Math.ceil((last_date - new_date) / (7 * 24 * 60 * 60 * 1000));
  }

  function filterLanguage(week, rating) {
    week("All");
    rating("All");
    return cacheVolunteer.filter(
      (el) =>
        language == "All" ||
        language == languageMap[el.classes[el.classes.length - 1].lang]
    );
  }

  const sortVolunteers = (byMethod) => {
    let sortedVolunteers;
    if (byMethod === "enroll_date") {
      sortedVolunteers = volunteer.sort((a, b) =>
        sortMethod === "asc"
          ? new Date(a.last_class_date) - new Date(b.last_class_date)
          : new Date(b.last_class_date) - new Date(a.last_class_date)
      );
    }
    setVolunteer(sortedVolunteers);
    setSlicedVolunteer(
      sortedVolunteers.slice(pageNumber * limit, (pageNumber + 1) * limit)
    );
    if (sortMethod === "asc") {
      setSortMethod("dsc");
    } else {
      setSortMethod("asc");
    }
  };

  useEffect(() => {
    const data =
      volunteer &&
      volunteer.filter((searchValue) =>
        searchValue.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const slicedData = data.slice(pageNumber * limit, (pageNumber + 1) * limit);
    // setVolunteer(data);
    setSlicedVolunteer(slicedData);
  }, [debouncedText, pageNumber]);

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="subtitle1" mt={10} mb={3}>
          Volunteer List
        </Typography>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "black" }} />
              </InputAdornment>
            ),
          }}
          fullWidth={1}
          type="text"
          placeholder=" Name, Class, Title, Language"
          variant="standard"
          value={debouncedText}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <Stack direction="row" spacing={2} pt={3} mb={4}>
          <Button
            variant="outlined"
            sx={{ borderRadius: "50px", borderColor: "Gray" }}
            onClick={() => {
              setSlicedVolunteer(filterPathway("Python", cacheVolunteer));
              setSelectedPathway("Python");
            }}
          >
            <Typography sx={{ color: "Gray" }}>Python</Typography>
          </Button>

          <Button
            variant="outlined"
            sx={{ borderRadius: "50px", borderColor: "Gray" }}
            onClick={() => {
              setSlicedVolunteer(
                filterPathway("Spoken English", cacheVolunteer)
              );
              setSelectedPathway("Spoken English");
            }}
          >
            <Typography sx={{ color: "Gray" }}>Spoken English</Typography>
          </Button>

          <Button
            variant="outlined"
            sx={{ borderRadius: "50px", borderColor: "Gray" }}
            onClick={() => {
              setSlicedVolunteer(filterPathway("Typing", cacheVolunteer));
              setSelectedPathway("Typing");
            }}
          >
            <Typography sx={{ color: "Gray" }}>Typing</Typography>
          </Button>
          <Button
            onClick={() => {
              setSelectedPathway("Filter");
              setSlicedVolunteer(cacheVolunteer);
            }}
          >
            <FilterListIcon sx={{ color: "Gray" }} />
            <Typography sx={{ color: "Gray" }}>Filter</Typography>
          </Button>
        </Stack>

        {selctedPathway === "Filter" ? (
          <Box container sx={{ display: "flax" }}>
            <Box>
              <Typography>Duration</Typography>
              <Select variant="standard" sx={{ m: 1, minWidth: 300 }}>
                <Box>
                  <MenuItem value="All Time">All Time</MenuItem>
                  {[1, 4, 8, 12].map((num) => {
                    const description = "Past" + num + "weeks";
                    return (
                      <MenuItem value={description}>{description}</MenuItem>
                    );
                  })}
                  <Typography
                    onClick={(e) => {
                      setSlicedVolunteer(filterweek(setLangue, setRating));
                      handleDropdown(e)("duration");
                    }}
                  >
                    Apply
                  </Typography>
                </Box>
              </Select>
            </Box>

            <Box>
              <Typography>Language</Typography>
              <Select variant="standard" sx={{ m: 1, minWidth: 300 }}>
                <Box>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                  <Typography
                    onClick={(e) => {
                      setSlicedVolunteer(filterLanguage(setWeek, setRating));
                      handleDropdown(e)("language");
                    }}
                  >
                    Apply
                  </Typography>
                </Box>
              </Select>
            </Box>

            <Box>
              <Typography>Avg. Rating</Typography>
              <Select
                sx={{ width: 300 }}
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                variant="standard"
              >
                <Box>
                  <MenuItem value={"All"}>All</MenuItem>
                  <MenuItem value={"4 Stars"}>
                    <img src={star} />
                    <img src={star} />
                    <img src={star} />
                    <img src={star} />& Above
                  </MenuItem>
                  <MenuItem value={"3 Stars"}>
                    <img src={star} />
                    <img src={star} />
                    <img src={star} />
                  </MenuItem>
                  <MenuItem value={"2 Stars"}>
                    <img src={star} />
                    <img src={star} />
                  </MenuItem>
                  <MenuItem value={"1 Stars"}>
                    <img src={star} />
                  </MenuItem>
                  <Typography
                    onClick={(e) => {
                      setSlicedVolunteer(ratings(setWeek, setLangue));
                      handleDropdown(e)("rating");
                    }}
                  >
                    Select (1)
                  </Typography>
                </Box>
              </Select>
            </Box>
          </Box>
        ) : (
          ""
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontWeight: "bold" }}>Name</Typography>{" "}
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontWeight: "bold" }}>
                  No. of Classes
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontWeight: "bold" }}>
                  Engagement (Weeks)
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontWeight: "bold" }}>
                  Last Class Date
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontWeight: "bold" }}>
                  Last Class Title
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontWeight: "bold" }}>
                  Last Class Lang
                </Typography>{" "}
              </TableCell>
              <TableCell align="right">
                <Typography sx={{ fontWeight: "bold" }}>Avg.Rating</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <Divider sx={{ fontWeight: "bold" }} />
          <TableBody>
            {slicedVolunteer && slicedVolunteer.length > 0 ? (
              slicedVolunteer.map((item) => {
                let ratingCount = 0;
                let count = 0;
                item.classes.map((classes) => {
                  classes.ratings.map((rating) => {
                    if (rating.rating) {
                      ratingCount += parseInt(rating.rating);
                      count += 1;
                    }
                  });
                });
                item.avg_rating = Math.ceil(ratingCount / count);
                const sortedClasses =
                  item.classes.length &&
                  item.classes.sort((a, b) => {
                    return new Date(a.start_time) - new Date(b.start_time);
                  });
                item.last_class_date =
                  sortedClasses.length &&
                  sortedClasses[sortedClasses.length - 1].start_time;
                let getStars = 0;
                let totalStarts = item.classes.length * 5;
                item.classes.map((stars) => {
                  getStars = getStars + Number(stars.classes);
                });
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link
                        className="t-data"
                        to={{
                          pathname: `/volunteer/${item.id}`,
                          state: {
                            pass: item,
                            passName: item.name,
                          },
                        }}
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>{item.classes.length}</TableCell>
                    <TableCell>{numberOfWeek(item)}</TableCell>
                    <TableCell>
                      {/*moment(
                        item.last_class_date
                        // sortedClasses[sortedClasses.length - 1].start_time
                      ).format("DD-MM-YYYY")*/}
                      {format(item.last_class_date, "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell>
                      {item.classes &&
                      item.classes.length > 0 &&
                      item.classes[item.classes.length - 1]["title"] != ""
                        ? item.classes[item.classes.length - 1]["title"]
                        : "NA"}
                    </TableCell>
                    <TableCell>
                      {item.classes &&
                      item.classes.length > 0 &&
                      item.classes[item.classes.length - 1]["lang"] != ""
                        ? languageMap[
                            item.classes[item.classes.length - 1]["lang"]
                          ]
                        : "NA"}
                    </TableCell>
                    <TableCell>
                      {[1, 2, 3, 4, 5].map((star) => {
                        return Math.ceil(item.avg_rating) > 0 &&
                          star <= Math.ceil(item.avg_rating) ? (
                          <Box
                            className="fa fa-star"
                            style={{ color: "#D55F31" }}
                          ></Box>
                        ) : (
                          <Box
                            className="fa fa-star"
                            style={{ color: "gray" }}
                          ></Box>
                        );
                      })}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <Typography variant="subtitle1">
                There are no results to display...
              </Typography>
            )}
          </TableBody>
        </Table>
        <Divider />

        <Grid container mt={4}>
          <Grid item xs={4}>
            <Typography pt={2}>
              Showing {pageNumber * limit + 1}-
              {(pageNumber + 1) * limit > volunteer.length
                ? volunteer.length
                : (pageNumber + 1) * limit}
              of {volunteer.length}
            </Typography>
          </Grid>
          <Grid item xs={4} align="right">
            <ReactPaginate
              count={5}
              color="primary"
              // defaultPage={3}
              previousLabel={<i className="fa fa-angle-left "></i>}
              nextLabel={<i className="fa fa-angle-right"></i>}
              initialPage={0}
              marginPagesDisplayed={0}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName="paginationBttns-volunteer"
              previousLinkClassName="previousBttn"
              nextLinkClassName="nextBttn"
              disabledClassName="paginationDisabled"
              activeClassName="paginationActive-volunteer"
            />
          </Grid>
        </Grid>
      </Container>

      <div className="volunteer-container">
        <div>
          <input
            className="volunteer-search-bar"
            type="text"
            placeholder="Search by Name "
            value={debouncedText}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <div className="filter-items">
          <button
            className={
              "filter-button " +
              (selctedPathway === "Python" ? "selectedPathway" : "")
            }
            onClick={() => {
              setSlicedVolunteer(filterPathway("Python", cacheVolunteer));
              setSelectedPathway("Python");
            }}
          >
            Python
          </button>
          <button
            className={
              "filter-button " +
              (selctedPathway === "Spoken English" ? "selectedPathway" : "")
            }
            onClick={() => {
              setSlicedVolunteer(
                filterPathway("Spoken English", cacheVolunteer)
              );
              setSelectedPathway("Spoken English");
            }}
          >
            Spoken English
          </button>
          <button
            className={
              "filter-button " +
              (selctedPathway === "Typing" ? "selectedPathway" : "")
            }
            onClick={() => {
              setSlicedVolunteer(filterPathway("Typing", cacheVolunteer));
              setSelectedPathway("Typing");
            }}
          >
            Typing
          </button>
          <button
            className={
              "filter-button " +
              (selctedPathway === "Filter" ? "selectedPathway" : "")
            }
            onClick={() => {
              setSelectedPathway("Filter");
              setSlicedVolunteer(cacheVolunteer);
            }}
          >
            Filter
          </button>
        </div>

        {selctedPathway === "Filter" ? (
          <div className="filterBar">
            <div className="filter">
              <span>Duration</span>
              <button onClick={(e) => handleDropdown(e)("duration")}>
                {week === "All" ? "All Time" : `Past ${week} week`}
              </button>
              {dropdowns.duration ? (
                <div className="dropdown">
                  <ul>
                    <li
                      onClick={() => {
                        setWeek("All");
                      }}
                      className={week === "All" ? "checked" : ""}
                      value="All Time"
                    >
                      All Time
                    </li>
                    <li
                      onClick={() => {
                        setWeek(1);
                      }}
                      className={week === 1 ? "checked" : ""}
                      value="Past 1 week"
                    >
                      Past 1 week
                    </li>
                    <li
                      onClick={() => {
                        setWeek(4);
                      }}
                      className={week === 4 ? "checked" : ""}
                      value="Past 4 week"
                    >
                      Past 4 week
                    </li>
                    <li
                      onClick={() => {
                        setWeek(8);
                      }}
                      className={week === 8 ? "checked" : ""}
                      value="Past 8 week"
                    >
                      Past 8 week
                    </li>
                    <li
                      onClick={() => {
                        setWeek(12);
                      }}
                      className={week === 12 ? "checked" : ""}
                      value="Past 12 week"
                    >
                      Past 12 week
                    </li>
                  </ul>
                  <span
                    onClick={(e) => {
                      setSlicedVolunteer(filterweek(setLangue, setRating));
                      handleDropdown(e)("duration");
                    }}
                  >
                    Apply
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="filter">
              <span>Language</span>
              <button onClick={(e) => handleDropdown(e)("language")}>
                {language == "All" ? "All Languages" : language}
              </button>
              {dropdowns.language ? (
                <div className="dropdown">
                  <ul>
                    <li
                      onClick={(e) => {
                        setLangue("All");
                      }}
                      className={language == "All" ? "checked" : ""}
                      value="All"
                    >
                      All
                    </li>
                    <li
                      onClick={(e) => {
                        setLangue("English");
                      }}
                      className={language == "English" ? "checked" : ""}
                      value="English"
                    >
                      English
                    </li>
                    <li
                      onClick={(e) => {
                        setLangue("Hindi");
                      }}
                      className={language == "Hindi" ? "checked" : ""}
                      value="Hindi"
                    >
                      Hindi
                    </li>
                  </ul>
                  <span
                    onClick={(e) => {
                      setSlicedVolunteer(filterLanguage(setWeek, setRating));
                      handleDropdown(e)("language");
                    }}
                  >
                    Apply
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="filter">
              <span>Avg. Rating</span>
              <button onClick={(e) => handleDropdown(e)("rating")}>
                {rating === "All" ? "All Ratings" : `${rating} Star`}
              </button>
              {dropdowns.rating ? (
                <div className="dropdown">
                  <ul>
                    <li
                      onClick={() => {
                        setRating("All");
                      }}
                      className={rating === "All" ? "checked" : ""}
                      value="All ratings"
                    >
                      All
                    </li>
                    <li
                      onClick={() => {
                        setRating(4);
                      }}
                      className={rating === 4 ? "checked" : ""}
                      value="4 Stars"
                    >
                      <img src={star} />
                      <img src={star} />
                      <img src={star} />
                      <img src={star} />& Above
                    </li>
                    <li
                      onClick={() => {
                        setRating(3);
                      }}
                      className={rating === 3 ? "checked" : ""}
                      value="3 Stars"
                    >
                      <img src={star} />
                      <img src={star} />
                      <img src={star} />
                    </li>
                    <li
                      onClick={() => {
                        setRating(2);
                      }}
                      className={rating === 2 ? "checked" : ""}
                      value="2 Stars"
                    >
                      <img src={star} />
                      <img src={star} />
                    </li>
                    <li
                      onClick={() => {
                        setRating(1);
                      }}
                      className={rating === 1 ? "checked" : ""}
                      value="1 Stars"
                    >
                      <img src={star} />
                    </li>
                  </ul>
                  <span
                    onClick={(e) => {
                      setSlicedVolunteer(ratings(setWeek, setLangue));
                      handleDropdown(e)("rating");
                    }}
                  >
                    Select (1)
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}

        <table className="volunteer-overview-table">
          <thead>
            <tr>
              <th> Name</th>
              <th> No. of Classes </th>
              <th>Engagement (Weeks)</th>
              <th>
                Last Class Date
                <button
                  className="sort-volunteer"
                  onClick={() => sortVolunteers("enroll_date")}
                >
                  <BsArrowUpDown />
                </button>
              </th>
              <th>Last Class Title</th>
              <th> Last Class Lang </th>
              <th>Avg.Rating</th>
            </tr>
          </thead>
          <tbody>
            {/* {volunteer && volunteer.length > 0 ? ( */}
            {slicedVolunteer && slicedVolunteer.length > 0 ? (
              slicedVolunteer.map((item) => {
                let ratingCount = 0;
                let count = 0;
                item.classes.map((classes) => {
                  classes.ratings.map((rating) => {
                    if (rating.rating) {
                      ratingCount += parseInt(rating.rating);
                      count += 1;
                    }
                  });
                });
                item.avg_rating = Math.ceil(ratingCount / count);
                const sortedClasses =
                  item.classes.length &&
                  item.classes.sort((a, b) => {
                    return new Date(a.start_time) - new Date(b.start_time);
                  });
                item.last_class_date =
                  sortedClasses.length &&
                  sortedClasses[sortedClasses.length - 1].start_time;
                let getStars = 0;
                let totalStarts = item.classes.length * 5;
                item.classes.map((stars) => {
                  getStars = getStars + Number(stars.classes);
                });
                return (
                  <tr key={item.id}>
                    <td data-column="Name">
                      <Link
                        className="t-data"
                        to={{
                          pathname: `/volunteer/${item.id}`,
                          state: {
                            pass: item,
                            passName: item.name,
                          },
                        }}
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td data-column="No.of Classes">{item.classes.length}</td>
                    <td data-column="Engagement Week">{numberOfWeek(item)}</td>
                    <td data-column="Last Class Date">
                      {/*moment(
                        item.last_class_date
                        // sortedClasses[sortedClasses.length - 1].start_time
                      ).format("DD-MM-YYYY")*/}
                      {format(item.last_class_date, "dd-MM-yyyy")}
                    </td>
                    <td data-column="Last Class Title">
                      {item.classes &&
                      item.classes.length > 0 &&
                      item.classes[item.classes.length - 1]["title"] != ""
                        ? item.classes[item.classes.length - 1]["title"]
                        : "NA"}
                    </td>
                    <td data-column="Last class lang">
                      {item.classes &&
                      item.classes.length > 0 &&
                      item.classes[item.classes.length - 1]["lang"] != ""
                        ? languageMap[
                            item.classes[item.classes.length - 1]["lang"]
                          ]
                        : "NA"}
                    </td>
                    <td data-column="Avg.Rating">
                      {/* {item.classes.ratings} */}
                      {/* {item.classes &&
                item.classes.length > 0 && item.classes[item.classes.length - 1
                ]["ratings"] != ""
                ? item.classes[
                item.classes.length - 1
                ]["ratings"]
                : "NA"}  */}
                      {[1, 2, 3, 4, 5].map((star) => {
                        return Math.ceil(item.avg_rating) > 0 &&
                          star <= Math.ceil(item.avg_rating) ? (
                          <span
                            className="fa fa-star"
                            style={{ color: "#D55F31" }}
                          ></span>
                        ) : (
                          <span
                            className="fa fa-star"
                            style={{ color: "gray" }}
                          ></span>
                        );
                      })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <div className="message ">
                <h3>There are no results to display...</h3>
              </div>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default VolunteerDashboard;

// <>
// <div className="volunteer-container">
//   <div>
//     <input
//       className="volunteer-search-bar"
//       type="text"
//       placeholder="Search by Name "
//       value={debouncedText}
//       onChange={(e) => {
//         setSearchTerm(e.target.value);
//       }}
//     />
//   </div>

//   <div className="filter-items">
//     <button
//       className={
//         "filter-button " +
//         (selctedPathway === "Python" ? "selectedPathway" : "")
//       }
//       onClick={() => {
//         setSlicedVolunteer(filterPathway("Python", cacheVolunteer));
//         setSelectedPathway("Python");
//       }}
//     >
//       Python
//     </button>
//     <button
//       className={
//         "filter-button " +
//         (selctedPathway === "Spoken English" ? "selectedPathway" : "")
//       }
//       onClick={() => {
//         setSlicedVolunteer(
//           filterPathway("Spoken English", cacheVolunteer)
//         );
//         setSelectedPathway("Spoken English");
//       }}
//     >
//       Spoken English
//     </button>
//     <button
//       className={
//         "filter-button " +
//         (selctedPathway === "Typing" ? "selectedPathway" : "")
//       }
//       onClick={() => {
//         setSlicedVolunteer(filterPathway("Typing", cacheVolunteer));
//         setSelectedPathway("Typing");
//       }}
//     >
//       Typing
//     </button>
//     <button
//       className={
//         "filter-button " +
//         (selctedPathway === "Filter" ? "selectedPathway" : "")
//       }
//       onClick={() => {
//         setSelectedPathway("Filter");
//         setSlicedVolunteer(cacheVolunteer);
//       }}
//     >
//       Filter
//     </button>
//   </div>

//   {selctedPathway === "Filter" ? (
//     <div className="filterBar">
//       <div className="filter">
//         <span>Duration</span>
//         <button onClick={(e) => handleDropdown(e)("duration")}>
//           {week === "All" ? "All Time" : `Past ${week} week`}
//         </button>
//         {dropdowns.duration ? (
//           <div className="dropdown">
//             <ul>
//               <li
//                 onClick={() => {
//                   setWeek("All");
//                 }}
//                 className={week === "All" ? "checked" : ""}
//                 value="All Time"
//               >
//                 All Time
//               </li>
//               <li
//                 onClick={() => {
//                   setWeek(1);
//                 }}
//                 className={week === 1 ? "checked" : ""}
//                 value="Past 1 week"
//               >
//                 Past 1 week
//               </li>
//               <li
//                 onClick={() => {
//                   setWeek(4);
//                 }}
//                 className={week === 4 ? "checked" : ""}
//                 value="Past 4 week"
//               >
//                 Past 4 week
//               </li>
//               <li
//                 onClick={() => {
//                   setWeek(8);
//                 }}
//                 className={week === 8 ? "checked" : ""}
//                 value="Past 8 week"
//               >
//                 Past 8 week
//               </li>
//               <li
//                 onClick={() => {
//                   setWeek(12);
//                 }}
//                 className={week === 12 ? "checked" : ""}
//                 value="Past 12 week"
//               >
//                 Past 12 week
//               </li>
//             </ul>
//             <span
//               onClick={(e) => {
//                 setSlicedVolunteer(filterweek(setLangue, setRating));
//                 handleDropdown(e)("duration");
//               }}
//             >
//               Apply
//             </span>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>
//       <div className="filter">
//         <span>Language</span>
//         <button onClick={(e) => handleDropdown(e)("language")}>
//           {language == "All" ? "All Languages" : language}
//         </button>
//         {dropdowns.language ? (
//           <div className="dropdown">
//             <ul>
//               <li
//                 onClick={(e) => {
//                   setLangue("All");
//                 }}
//                 className={language == "All" ? "checked" : ""}
//                 value="All"
//               >
//                 All
//               </li>
//               <li
//                 onClick={(e) => {
//                   setLangue("English");
//                 }}
//                 className={language == "English" ? "checked" : ""}
//                 value="English"
//               >
//                 English
//               </li>
//               <li
//                 onClick={(e) => {
//                   setLangue("Hindi");
//                 }}
//                 className={language == "Hindi" ? "checked" : ""}
//                 value="Hindi"
//               >
//                 Hindi
//               </li>
//             </ul>
//             <span
//               onClick={(e) => {
//                 setSlicedVolunteer(filterLanguage(setWeek, setRating));
//                 handleDropdown(e)("language");
//               }}
//             >
//               Apply
//             </span>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>
//       <div className="filter">
//         <span>Avg. Rating</span>
//         <button onClick={(e) => handleDropdown(e)("rating")}>
//           {rating === "All" ? "All Ratings" : `${rating} Star`}
//         </button>
//         {dropdowns.rating ? (
//           <div className="dropdown">
//             <ul>
//               <li
//                 onClick={() => {
//                   setRating("All");
//                 }}
//                 className={rating === "All" ? "checked" : ""}
//                 value="All ratings"
//               >
//                 All
//               </li>
//               <li
//                 onClick={() => {
//                   setRating(4);
//                 }}
//                 className={rating === 4 ? "checked" : ""}
//                 value="4 Stars"
//               >
//                 <img src={star} />
//                 <img src={star} />
//                 <img src={star} />
//                 <img src={star} />& Above
//               </li>
//               <li
//                 onClick={() => {
//                   setRating(3);
//                 }}
//                 className={rating === 3 ? "checked" : ""}
//                 value="3 Stars"
//               >
//                 <img src={star} />
//                 <img src={star} />
//                 <img src={star} />
//               </li>
//               <li
//                 onClick={() => {
//                   setRating(2);
//                 }}
//                 className={rating === 2 ? "checked" : ""}
//                 value="2 Stars"
//               >
//                 <img src={star} />
//                 <img src={star} />
//               </li>
//               <li
//                 onClick={() => {
//                   setRating(1);
//                 }}
//                 className={rating === 1 ? "checked" : ""}
//                 value="1 Stars"
//               >
//                 <img src={star} />
//               </li>
//             </ul>
//             <span
//               onClick={(e) => {
//                 setSlicedVolunteer(ratings(setWeek, setLangue));
//                 handleDropdown(e)("rating");
//               }}
//             >
//               Select (1)
//             </span>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>
//     </div>
//   ) : (
//     ""
//   )}

//   <table className="volunteer-overview-table">
//     <thead>
//       <tr>
//         <th> Name</th>
//         <th> No. of Classes </th>
//         <th>Engagement (Weeks)</th>
//         <th>
//           Last Class Date
//           <button
//             className="sort-volunteer"
//             onClick={() => sortVolunteers("enroll_date")}
//           >
//             <BsArrowUpDown />
//           </button>
//         </th>
//         <th>Last Class Title</th>
//         <th> Last Class Lang </th>
//         <th>Avg.Rating</th>
//       </tr>
//     </thead>
//     <tbody>
//       {/* {volunteer && volunteer.length > 0 ? ( */}
//       {slicedVolunteer && slicedVolunteer.length > 0 ? (
//         slicedVolunteer.map((item) => {
//           let ratingCount = 0;
//           let count = 0;
//           item.classes.map((classes) => {
//             classes.ratings.map((rating) => {
//               if (rating.rating) {
//                 ratingCount += parseInt(rating.rating);
//                 count += 1;
//               }
//             });
//           });
//           item.avg_rating = Math.ceil(ratingCount / count);
//           const sortedClasses =
//             item.classes.length &&
//             item.classes.sort((a, b) => {
//               return new Date(a.start_time) - new Date(b.start_time);
//             });
//           item.last_class_date =
//             sortedClasses.length &&
//             sortedClasses[sortedClasses.length - 1].start_time;
//           let getStars = 0;
//           let totalStarts = item.classes.length * 5;
//           item.classes.map((stars) => {
//             getStars = getStars + Number(stars.classes);
//           });
//           return (
//             <tr key={item.id}>
//               <td data-column="Name">
//                 <Link
//                   className="t-data"
//                   to={{
//                     pathname: `/volunteer/${item.id}`,
//                     state: {
//                       pass: item,
//                       passName: item.name,
//                     },
//                   }}
//                 >
//                   {item.name}
//                 </Link>
//               </td>
//               <td data-column="No.of Classes">{item.classes.length}</td>
//               <td data-column="Engagement Week">{numberOfWeek(item)}</td>
//               <td data-column="Last Class Date">
//                 {moment(
//                   item.last_class_date
//                   // sortedClasses[sortedClasses.length - 1].start_time
//                 ).format("DD-MM-YYYY")}
//               </td>
//               <td data-column="Last Class Title">
//                 {item.classes &&
//                 item.classes.length > 0 &&
//                 item.classes[item.classes.length - 1]["title"] != ""
//                   ? item.classes[item.classes.length - 1]["title"]
//                   : "NA"}
//               </td>
//               <td data-column="Last class lang">
//                 {item.classes &&
//                 item.classes.length > 0 &&
//                 item.classes[item.classes.length - 1]["lang"] != ""
//                   ? languageMap[
//                       item.classes[item.classes.length - 1]["lang"]
//                     ]
//                   : "NA"}
//               </td>
//               <td data-column="Avg.Rating">
//                 {/* {item.classes.ratings} */}
//                 {/* {item.classes &&
//                 item.classes.length > 0 && item.classes[item.classes.length - 1
//                 ]["ratings"] != ""
//                 ? item.classes[
//                 item.classes.length - 1
//                 ]["ratings"]
//                 : "NA"}  */}
//                 {[1, 2, 3, 4, 5].map((star) => {
//                   return Math.ceil(item.avg_rating) > 0 &&
//                     star <= Math.ceil(item.avg_rating) ? (
//                     <span
//                       className="fa fa-star"
//                       style={{ color: "#D55F31" }}
//                     ></span>
//                   ) : (
//                     <span
//                       className="fa fa-star"
//                       style={{ color: "gray" }}
//                     ></span>
//                   );
//                 })}
//               </td>
//             </tr>
//           );
//         })
//       ) : (
//         <div className="message ">
//           <h3>There are no results to display...</h3>
//         </div>
//       )}
//     </tbody>
//   </table>

//   <div className="pagination-footer">
//     <div>
//       <p className="page-descrption">
//         Showing {pageNumber * limit + 1}-
//         {(pageNumber + 1) * limit > volunteer.length
//           ? volunteer.length
//           : (pageNumber + 1) * limit}
//         of {volunteer.length}
//       </p>
//     </div>
//     <div className="pagination">
//       <ReactPaginate
//         previousLabel={<i className="fa fa-angle-left "></i>}
//         nextLabel={<i className="fa fa-angle-right"></i>}
//         initialPage={0}
//         marginPagesDisplayed={0}
//         pageCount={pageCount}
//         onPageChange={changePage}
//         containerClassName="paginationBttns-volunteer"
//         previousLinkClassName="previousBttn"
//         nextLinkClassName="nextBttn"
//         disabledClassName="paginationDisabled"
//         activeClassName="paginationActive-volunteer"
//       />
//     </div>
//   </div>
// </div>
// </>
