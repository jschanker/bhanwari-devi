import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { METHODS } from "../../services/api";
import { useDebounce } from "use-debounce";
import moment from "moment";
import { Link } from "react-router-dom";
import "./styles.scss";
import { BsArrowUpDown } from "react-icons/bs";

const getPartnerIdFromUrl = () => {
  let partnerId;
  if (window.location.pathname.includes("partners")) {
    partnerId = window.location.pathname.split("/").pop();
  }
  return partnerId;
};

function StudentData() {
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ascendingByStudentName, setAscendingByStudentName] = useState(true);
  const [ascendingByDate, setAscendingByDate] = useState(true);
  const [ascendingByTotalClass, setAscendingByTotalClass] = useState(true);
  const [ascendingByRating, setAscendingByRating] = useState(true);
  const [ascendingAlphabetically, setAscendingAlphabetically] = useState(true);
  const [ascendingNumerically, setAscendingNumerically] = useState(true);
  const [loading, setLoading] = useState(true);
  const [debouncedText] = useDebounce(searchTerm);
  const user = useSelector(({ User }) => User);

  useEffect(() => {
    let id = getPartnerIdFromUrl();
    axios
      .get(`https://api.merakilearn.org/partners/${id}/users`, {
        headers: { Authorization: user.data.token },
      })
      .then((res) => {
        if (res.data.length < 1) {
          setMessage("There are no results to display");
        } else {
          const data = res.data.map((item) => {
            return {
              ...item,
              created_at: moment(item.created_at.replace("Z", "")).format(
                "DD-MM-YYYY"
              ),
              classes_registered: item.classes_registered.map((item) => {
                return {
                  ...item,
                  start_time: moment(item.start_time.replace("Z", "")).format(
                    "DD-MM-YYYY"
                  ),
                  item,
                  end_time: moment(item.end_time.replace("Z", "")).format(
                    "hh:mm a"
                  ),
                };
              }),
            };
          });
          setStudents(data);
        }
      });
  }, []);

  const Students = students.filter((searchValue) => {
    if (searchTerm == "") {
      return searchValue;
    } else if (
      searchValue.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return searchValue;
    }
  });

  // console.log("Students", Students);

  const studentData = (item, getStars, totalStarts) => {
    return (
      <tr key={item.id}>
        <td data-column="Name">
          <Link
            className="t-data"
            to={{
              pathname: "/student",
              state: {
                pass: item.classes_registered,
                passName: item.name,
              },
            }}
          >
            {item.name}
          </Link>
        </td>
        <td data-column="Enrolled On">{item.created_at}</td>
        <td data-column="Total classes "> {item.classes_registered.length}</td>
        <td data-column="Last class title">
          {item.classes_registered &&
          item.classes_registered.length > 0 &&
          item.classes_registered[item.classes_registered.length - 1][
            "title"
          ] != ""
            ? item.classes_registered[item.classes_registered.length - 1][
                "title"
              ]
            : "NA"}
        </td>
        <td data-column="Last class date">
          {item.classes_registered &&
          item.classes_registered.length > 0 &&
          item.classes_registered[item.classes_registered.length - 1][
            "start_time"
          ]
            ? item.classes_registered[item.classes_registered.length - 1][
                "start_time"
              ]
            : "NA"}
        </td>
        <td data-column="Last class time">
          {item.classes_registered &&
          item.classes_registered.length > 0 &&
          item.classes_registered[item.classes_registered.length - 1][
            "end_time"
          ]
            ? item.classes_registered[item.classes_registered.length - 1][
                "end_time"
              ]
            : "NA"}
        </td>
        <td data-column="Avg Class Rating ">
          {[1, 2, 3, 4, 5].map((star) => {
            return Math.ceil(getStars / totalStarts) > 0 &&
              star <= Math.ceil(getStars / totalStarts) ? (
              <span className="fa fa-star" style={{ color: "#D55F31" }}></span>
            ) : (
              <span className="fa fa-star" style={{ color: "gray" }}></span>
            );
          })}
        </td>
      </tr>
    );
  };

  const avgRating = () => {
    // Students
    // .slice(0, 10)
    Students.map((item) => {
      let getStars = 0;
      let totalStarts = item.classes_registered.length * 5;
      item.classes_registered.map((stars) => {
        getStars = getStars + Number(stars.feedback.feedback);
      });
      // return studentData(item, getStars, totalStarts);
      return { ...item, avg: Math.ceil(getStars / totalStarts) };
    });

    // return Math.ceil(getStars / totalStarts)
    return Students;
  };

  // console.log("avgRating", avgRating());

  const sortByStudentsName = () => {
    setAscendingByStudentName(!ascendingByStudentName);
    setAscendingAlphabetically(true);
    setLoading(true);
  };

  const sortByDate = () => {
    setAscendingByDate(!ascendingByDate);
    setAscendingAlphabetically(false);
    setLoading(true);
  };

  const sortByTotalClass = () => {
    setAscendingByTotalClass(!ascendingByTotalClass);
    setAscendingNumerically(true);
    setLoading(false);
  };

  const sortByRating = () => {
    setAscendingByRating(!ascendingByRating);
    setAscendingNumerically(false);
    setLoading(false);
  };

  return (
    <div className="container-table">
      <input
        className="Search-bar"
        type="text"
        placeholder="Search by student name,class...."
        value={debouncedText}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      <table className="student-overview-table" style={{ marginTop: "30px" }}>
        <thead>
          <tr>
            <th>
              Students Name
              <button
                type="button"
                onClick={sortByStudentsName}
                className="sortButtonName"
              >
                <BsArrowUpDown />
              </button>
            </th>
            <th>
              Enroll date
              <button
                type="button"
                onClick={sortByDate}
                className="sortButtonN"
              >
                <BsArrowUpDown />
              </button>
            </th>
            <th>
              Total Classes Attended
              <button
                type="button"
                onClick={sortByTotalClass}
                className="sortButtonN"
              >
                <BsArrowUpDown />
              </button>
            </th>
            <th>Last Class Title</th>
            <th>Last Class Date </th>
            <th>Last Class Time</th>
            <th>
              Avg Class Rating
              <button
                type="button"
                onClick={sortByRating}
                className="sortButtonN"
              >
                <BsArrowUpDown />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            loading
              ? ascendingAlphabetically
                ? ascendingByStudentName
                  ? Students.slice(0)
                      .sort(function (a, b) {
                        var nameA = a.name.toLowerCase();
                        var nameB = b.name.toLowerCase();
                        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
                      })
                      // .slice(0, 10)
                      .map((item) => {
                        // console.log("item", item);
                        let getStars = 0;
                        let totalStarts = item.classes_registered.length * 5;
                        item.classes_registered.map((stars) => {
                          getStars = getStars + Number(stars.feedback.feedback);
                        });
                        return studentData(item, getStars, totalStarts);
                      })
                  : Students.slice(0)
                      .sort(function (a, b) {
                        var nameA = a.name.toLowerCase();
                        var nameB = b.name.toLowerCase();
                        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
                      })
                      .reverse()
                      // .slice(0, 10)
                      .map((item) => {
                        let getStars = 0;
                        let totalStarts = item.classes_registered.length * 5;
                        item.classes_registered.map((stars) => {
                          getStars = getStars + Number(stars.feedback.feedback);
                        });
                        return studentData(item, getStars, totalStarts);
                      })
                : ascendingByDate
                ? Students.slice(0)
                    .sort(function (a, b) {
                      const dateA = new Date(a.created_at);
                      const dateB = new Date(b.created_at);
                      return dateB - dateA;
                    })
                    // .slice(0, 10)
                    .map((item) => {
                      let getStars = 0;
                      let totalStarts = item.classes_registered.length * 5;
                      item.classes_registered.map((stars) => {
                        getStars = getStars + Number(stars.feedback.feedback);
                      });
                      return studentData(item, getStars, totalStarts);
                    })
                : Students.slice(0)
                    .sort(function (a, b) {
                      const dateA = new Date(a.created_at);
                      const dateB = new Date(b.created_at);
                      return dateB - dateA;
                    })
                    .reverse()
                    // .slice(0, 10)
                    .map((item) => {
                      let getStars = 0;
                      let totalStarts = item.classes_registered.length * 5;
                      item.classes_registered.map((stars) => {
                        getStars = getStars + Number(stars.feedback.feedback);
                      });
                      return studentData(item, getStars, totalStarts);
                    })
              : ascendingNumerically
              ? ascendingByTotalClass
                ? Students.slice(0)
                    .sort(function (a, b) {
                      var numberA = a.classes_registered.length;
                      var numberB = b.classes_registered.length;
                      return numberB - numberA;
                    })
                    // .slice(0, 10)
                    .map((item) => {
                      let getStars = 0;
                      let totalStarts = item.classes_registered.length * 5;
                      item.classes_registered.map((stars) => {
                        getStars = getStars + Number(stars.feedback.feedback);
                      });
                      return studentData(item, getStars, totalStarts);
                    })
                : Students.slice(0)
                    .sort(function (a, b) {
                      var numberA = a.classes_registered.length;
                      var numberB = b.classes_registered.length;
                      return numberA - numberB;
                    })
                    // .reverse()
                    // .slice(0, 10)
                    .map((item) => {
                      let getStars = 0;
                      let totalStarts = item.classes_registered.length * 5;
                      item.classes_registered.map((stars) => {
                        getStars = getStars + Number(stars.feedback.feedback);
                      });
                      return studentData(item, getStars, totalStarts);
                    })
              : ascendingByRating
              ? avgRating()
              : // .sort(function (a, b) {
                //   // console.log("a", a);
                // })
                // .map((item) => {
                //   // console.log("item", item);
                //   // return studentData(item, getStars, totalStarts);
                // })
                avgRating()
            // .sort(function (a, b) {
            //   // console.log("a", a);
            // })
            // .map((item) => {
            //   // console.log("item", item);
            //   // return studentData(item, getStars, totalStarts);
            // })
          }
          {message ? <h1>{message}</h1> : null}
        </tbody>
      </table>
    </div>
  );
}

export default StudentData;
