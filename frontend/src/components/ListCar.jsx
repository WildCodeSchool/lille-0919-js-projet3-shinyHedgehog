import React, { useEffect, useState } from "react";
import "./style/ListCar.scss";
import { Link } from "react-router-dom";
import axios from "axios";
const { apiSite } = require("../conf");

function ListCar() {
  const [nextMaintenance, setnextMaintenance] = useState([]);

  useEffect(() => {
    axios.get(`${apiSite}/vehicule/1/nextmaintenance`).then(({ data }) => {
      const lvls = calcLevels(data);
      const filtered = filterFamilies(lvls);
      setnextMaintenance(filtered);
    });
  }, [setnextMaintenance]);

  function calcLevels(oldPlan) {
    if (oldPlan)
      return oldPlan.map((elt, i) => {
        let color = "blue";
        if (elt.trajetFaitPourcentage >= 1 || elt.trajetFaitPourcentage < 0)
          color = "red";
        else if (elt.trajetFaitPourcentage >= 0.9) color = "orange";
        return { ...elt, niveau: color };
      });
  }

  function filterFamilies(oldPlan) {
    let families = [];
    let plan = oldPlan.sort((a, b) => {
      return b.trajetFaitPourcentage - a.trajetFaitPourcentage;
    });
    return plan.filter(item => {
      if (families.includes(item.famille)) {
        return false;
      }
      families.push(item.famille);
      return true;
    });
  }

  return (
    <div className="intFamilies">
      <div className="icones">
        {nextMaintenance.map((elt, i) => {
          return (
            <div key={i} className="module">
              <div id="imgIcone">
                <Link to={`intervention/${elt.famille}`}>
                  <img
                    src={`/pictures/icons/famille/${elt.niveau}_${elt.famille}.png`}
                    alt={elt.famille}
                  />
                  <h1>{elt.famille}</h1>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default ListCar;
