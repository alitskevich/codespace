import { Hash, arrayToObject } from "ultimus";

function arrangeLine(n, arr) {
  const found = arr.find(function (e) {
    return n >= e[0];
  });
  return found ? found[1] : null;
}

// Mapael map service.
function itemToPlot(item) {
  const weight = item.weight || 0;
  const plot = {
    attrs: {
      fill:
        arrangeLine(weight, [
          [50, "#6E0E0A"],
          [20, "#D74E09"],
          [3, "#f2b805"],
        ]) || "#f0f0c9",
      opacity: weight ? 0.8 : 0.3,
    },
    size:
      arrangeLine(weight, [
        [50, 28],
        [20, 20],
        [3, 15],
        [1, 12],
      ]) || 8,
    label: item.weight || 0,
    latitude: +item.lat,
    longitude: +item.lng,
    href: item.href || "#",
    tooltip: {
      content:
        (!item.tooltip ? "" : `<span style="font-weight:bold;">${item.tooltip}</span>`) +
        (!item.tooltipHint ? "" : `<br/><span style="font-weight:normal;">${item.tooltipHint}</span>`),
    },
  };
  return plot;
}

// @see https://www.vincentbroute.fr/mapael/#api-reference
export class MapaelService {
  plots = {};
  plotsItems?: Hash<any>;
  map: any;

  init() {
    setTimeout(() => {
      const config: any = {};

      config.map = this.map;

      config.map.defaultPlot.eventHandlers = {
        click: function (e, id, _mapElem, _textElem) {
          const item = this.plotsItems[id];
          if (item.disabled) return;
          this.onPlotItem?.(item);
          // console.log('plot', item)
          this.up({ plotItem: item });
        },
      };

      config.plots = this.plots || {};

      (window as any).$(".mapcontainer").mapael(config);
    }, 20);
  }

  onClearPlotItem() {
    return {
      plotItem: null,
    };
  }

  setPlotsItems(items) {

    const hash = arrayToObject(items);
    const newPlots = {};
    const existingPlots = this.plots || {};
    const deletePlotKeys: any[] = [];
    items.forEach(function (item) {
      if (existingPlots[item.id]) {
        existingPlots[item.id] = itemToPlot(item);
      } else {
        newPlots[item.id] = itemToPlot(item);
      }
    });
    Object.keys(existingPlots).forEach(function (id) {
      if (!hash[id]) {
        deletePlotKeys.push(id);
      }
    });
    (window as any).$(".mapcontainer").trigger("update", [
      {
        mapOptions: {
          plots: existingPlots,
        },
        newPlots: newPlots,
        deletePlotKeys: deletePlotKeys,
      },
    ]);
    this.plots = Object.assign({}, existingPlots, newPlots);
    this.plotsItems = hash;
  };
}
