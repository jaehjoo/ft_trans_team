import { useState } from "../../MyReact";
import JoinModal from "./_components/JoinModal";

const data = [
  {
    type: "one",
    title: "1:1 초보만",
    current: 2,
    max: 2,
    status: "Started",
    private: false,
  },
  {
    type: "two",
    title: "토너먼트 초보만",
    current: 1,
    max: 8,
    status: "Waiting",
    private: true,
  },
  {
    type: "one",
    title: "1:1 초보만",
    current: 2,
    max: 2,
    status: "Waiting",
    private: true,
  },
  {
    type: "two",
    title: "토너먼트 초보만",
    current: 2,
    max: 8,
    status: "Waiting",
    private: false,
  },
  {
    type: "one",
    title: "1:1 초보만",
    current: 2,
    max: 2,
    status: "Started",
    private: true,
  },
  {
    type: "one",
    title: "1:1 초보만",
    current: 2,
    max: 2,
    status: "Started",
    private: true,
  },
  {
    type: "one",
    title: "1:1 초보만",
    current: 2,
    max: 2,
    status: "Started",
    private: true,
  },
  {
    type: "one",
    title: "1:1 초보만",
    current: 2,
    max: 2,
    status: "Started",
    private: true,
  },
];

const JoinPage = () => {
  return /*html*/ `
  <div style="height : 60vh;">
  
  <div class="overflow-auto w-100 p-4" style="height: 40vh;">
    ${data
      .map((d, idx) => {
        return /*html*/ `
      <div class="card mb-2" key=${idx}>
        <div class="card-body d-flex gap-2">
          <div style="min-width : 150px;" class="d-flex justify-content-center align-items-center">${
            d.type === "one" ? "1 VS 1" : "Tournament"
          }</div>

          <div class="d-flex w-100 gap-4">
            <div class="d-flex justify-content-start align-items-center" style="min-width : 60%;">${
              d.title
            }</div>

            <img class="d-flex justify-content-start align-items-center" src=${`../../../public/img/icons/${
              d.private ? "lock" : "unlock"
            }.png`} style="width: 5%;" class="" alt="private">
            <div class="d-flex justify-content-start align-items-center" style="min-width : 10%;">${
              d.current
            } / ${d.max}</div>
            <div class="d-flex justify-content-start align-items-center" style="${
              d.status === "Started" ? "color: red;" : "color: green;"
            }">${d.status}</div>

            ${JoinModal(idx, data)}
          </div>
          
        </div>
      </div>
    `;
      })
      .join("")}
</div>


<div class="d-flex justify-content-around mt-5 w-100">
<a href="/main"><button class="btn btn-primary" style="width: 10rem;">Home</button></a>
<a href="/create"><button class="btn btn-primary" style="width: 10rem;">Create</button></a>
</div>

  `;
};

export default JoinPage;
