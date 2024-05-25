// https://script.google.com/macros/s/AKfycbzu2GTj-DnheQ4mnQap1E3kDwZhzOe_4QQmDpwNDTnAm0TEZseBlWqaLGOO0VIfIlBe/exec
export let legend2 = {
  plot: {
    cssClass: "myLegend",
    labelAttrs: {
      fill: "#4a4a4a",
    },
    titleAttrs: {
      fill: "#4a4a4a",
    },
    marginBottom: 20,
    marginLeft: 30,
    hideElemsOnClick: {
      opacity: 0,
    },
    title: "French cities population",
    slices: [
      {
        size: 4,
        type: "circle",
        max: 20000,
        attrs: {
          fill: "#ff5454",
        },
        label: "Less than 20000 inhabitants",
      },
      {
        size: 6,
        type: "circle",
        min: 20000,
        max: 100000,
        attrs: {
          fill: "#ff5454",
        },
        label: "Between 20000 and 100000 inhabitants",
      },
      {
        size: 20,
        type: "circle",
        min: 100000,
        max: 200000,
        attrs: {
          fill: "#ffbd54",
        },
        label: "Between 100000 et  200000 inhabitants",
      },
      {
        size: 40,
        type: "circle",
        min: 200000,
        attrs: {
          fill: "#ff5454",
        },
        label: "More than 200000 inhabitants",
      },
    ],
  },
},
  zoomedArea = "",
  // https://www.vincentbroute.fr/mapael/
  mapConfig = {
    name: "belarus_departments",
    zoom: {
      enabled: false,
    },
    defaultPlot: {
      attrs: {
        fill: "#004a9b",
        opacity: 0.6,
      },
      attrsHover: {
        opacity: 1,
      },
      text: {
        attrs: {
          fill: "#505444",
        },
        attrsHover: {
          fill: "#000",
        },
      },
    },
    defaultArea: {
      attrs: {
        fill: "#124e78",
        stroke: "#99c7ff",
        cursor: "pointer",
      },
      attrsHover: {
        fill: "#4464ad",
        animDuration: 0,
      },
      text: {
        attrs: {
          cursor: "pointer",
          "font-size": 10,
          fill: "#000",
        },
        attrsHover: {
          animDuration: 0,
        },
      },
      eventHandlers: {
        click(_e, id, _mapElem, _textElem) {
          // const newData = {
          //   areas: {},
          // };
          if (id === "BY-07") {
            id = "BY-CAP";
          }
          const isOn = zoomedArea == id;
          if (isOn) {
            zoomedArea = "";
          } else {
            zoomedArea = id;
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line no-undef
          $(".mapcontainer").trigger("zoom", !isOn ? { level: "+1", area: id } : { level: 0 });
          // $(".mapcontainer").trigger('update', [{ mapOptions: newData }]);
        },
      },
    },
  };
