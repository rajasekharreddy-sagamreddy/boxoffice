(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Router = require("./router").Router;

$(function () {
  var appRouter = new Router();
  Backbone.history.start({ pushState: true, root: "/admin/" });
  window.eventBus = _.clone(Backbone.Events);
  window.eventBus.on("navigate", function (msg) {
    appRouter.navigate(msg, { trigger: true });
  });
});

},{"./router":11}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var IndexModel = Backbone.Model.extend({
  url: function url() {
    return "/admin/dashboard";
  }
});
exports.IndexModel = IndexModel;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ItemCollectionModel = Backbone.Model.extend({
  url: function url(id) {
    return "/admin/ic/" + this.get("id");
  }
});
exports.ItemCollectionModel = ItemCollectionModel;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OrgModel = Backbone.Model.extend({
  url: function url(name) {
    console.log(this.get("name"));
    return "/admin/o/" + this.get("name");
  }
});
exports.OrgModel = OrgModel;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var IndexTemplate = "\n  {{#orgs}}\n    <a href=\"javascript:void(0)\" on-click=\"navigate\">{{title}}</a>\n  {{/}}\n";
exports.IndexTemplate = IndexTemplate;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TableTemplate = "\n  <div class=\"table-responsive stats\">\n    <table class=\"table table-bordered table-hover stats-table\">\n      <thead>\n        <tr class=\"info\">\n          <th>#</th>\n          <th>Item</th>\n          <th>Available</th>\n          <th>Sold</th>\n          <th>Free</th>\n          <th>Cancelled</th>\n          <th>Current Price</th>\n          <th>Net Sales</th>\n        </tr>\n      </thead>\n      <tbody>\n        {{#items}}\n          <tr>\n            <td>{{ @index + 1 }}</td>\n            <td>{{ title }}</td>\n            <td>{{ available }}</td>\n            <td>{{ sold }}</td>\n            <td>{{ free }}</td>\n            <td>{{ cancelled }}</td>\n            <td>{{ current_price }}</td>\n            <td>{{ net_sales }}</td>\n          </tr>\n        {{/}}\n      </tbody>\n    </table>\n  </div>\n";

exports.TableTemplate = TableTemplate;
var AggChartTemplate = "\n  <div id=\"chart\" class=\"c3\" style=\"max-height: 280px; position: relative;\">\n  </div>\n";

exports.AggChartTemplate = AggChartTemplate;
var ItemCollectionTemplate = "\n  <br>\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n          <h3 class=\"panel-title\">Net Sales</h3>\n        </div>\n        <div class=\"panel-body\">\n          {{net_sales}}\n        </div>\n      </div>\n    </div>\n  </div>\n  <hr>\n  <AggChartComponent></AggChartComponent>\n  <hr>\n  <TableComponent></TableComponent>\n";
exports.ItemCollectionTemplate = ItemCollectionTemplate;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var orgTemplate = "\n  <ul>\n    {{#item_collections}}\n      <li>\n        <a href=\"javascript:void(0)\" on-click=\"navigate\">{{title}}</a>\n      </li>\n    {{/}}\n  </ul>\n";
exports.orgTemplate = orgTemplate;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IndexModel = require("../models/index.js").IndexModel;

var IndexTemplate = require("../templates/index.html.js").IndexTemplate;

var IndexView = {
  render: function render() {
    console.log(!this.ractive);
    if (!this.indexModel) {
      this.indexModel = new IndexModel();
    }
    this.indexModel.fetch().then(function (data) {
      if (!this.ractive) {
        console.log("ractive");
        this.ractive = new Ractive({
          el: "#main-content-area",
          template: IndexTemplate,
          data: {
            orgs: data.orgs
          }
        });
        this.ractive.on("navigate", function (event, method) {
          // console.log(event.context.url);
          eventBus.trigger("navigate", event.context.url);
        });
      } else {
        this.ractive.render();
      }
    });
  }
};
exports.IndexView = IndexView;

},{"../models/index.js":2,"../templates/index.html.js":5}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ItemCollectionModel = require("../models/item_collection.js").ItemCollectionModel;

var _templatesItem_collectionHtmlJs = require("../templates/item_collection.html.js");

var TableTemplate = _templatesItem_collectionHtmlJs.TableTemplate;
var AggChartTemplate = _templatesItem_collectionHtmlJs.AggChartTemplate;
var ItemCollectionTemplate = _templatesItem_collectionHtmlJs.ItemCollectionTemplate;

// Components
// table
// chart

var TableComponent = Ractive.extend({
  isolated: false,
  template: TableTemplate
});

var AggChartComponent = Ractive.extend({
  template: AggChartTemplate,
  oncomplete: function oncomplete() {
    var date_item_counts = this.parent.get("date_item_counts");
    var items = this.parent.get("items");
    var date_sales = this.parent.get("date_sales");
    var dates = ["x"];
    var item_counts = {};
    var date_sales_column = ["date_sales"];
    for (var item_date in date_item_counts) {
      (function (item_date) {
        dates.push(item_date);
        date_sales_column.push(date_sales[item_date]);
        items.forEach(function (item) {
          if (!item_counts[item.id]) {
            item_counts[item.id] = [];
          }
          if (date_item_counts[item_date].hasOwnProperty(item.id)) {
            // If an item has been bought on this item_date
            item_counts[item.id].push(date_item_counts[item_date][item.id]);
          } else {
            // Item not bought on this date
            item_counts[item.id].push(0);
          }
        });
      })(item_date);
    }

    var columns = [dates];
    items.forEach(function (item) {
      columns.push([item.title].concat(item_counts[item.id]));
    });

    var bar_graph_headers = columns.map(function (col) {
      return col[0];
    }).filter(function (header) {
      return header !== "x";
    });

    columns.push(date_sales_column);

    this.chart = c3.generate({
      data: {
        x: "x",
        columns: columns,
        type: "bar",
        types: {
          date_sales: "line"
        },
        groups: [bar_graph_headers],
        axes: {
          date_sales: "y2"
        }
      },
      bar: {
        width: {
          ratio: 0.5 // this makes bar width 50% of length between ticks
        }
      },
      axis: {
        x: {
          type: "timeseries",
          tick: {
            format: "%d-%m"
          }
        },
        y2: {
          show: true
        }
      }
    });
  }
});

var ItemCollectionView = {
  init: function init(data) {
    var _this = this;

    this.ractive = new Ractive({
      el: "#main-content-area",
      template: ItemCollectionTemplate,
      data: {
        items: this.model.get("items"),
        date_item_counts: this.model.get("date_item_counts"),
        date_sales: this.model.get("date_sales"),
        net_sales: this.model.get("net_sales")
      },
      components: { TableComponent: TableComponent, AggChartComponent: AggChartComponent }
    });

    this.model.on("change:items", function (model, items) {
      return _this.ractive.set("items", items);
    });

    this.ractive.on("navigate", function (event, method) {
      // kill interval
      clearInterval(this.intervalId);
      eventBus.trigger("navigate", event.context.url);
    });
    window.addEventListener("popstate", function (event) {
      // kill interval
      clearInterval(_this.intervalId);
    });
  },
  fetch: function fetch() {
    var _this = this;

    return this.model.fetch().then(function (data) {
      _this.model.set("items", data.items);
      _this.model.set("date_item_counts", data.date_item_counts);
      _this.model.set("date_sales", data.date_sales);
      _this.model.set("net_sales", data.net_sales);
    });
  },
  refresh: function refresh() {
    this.fetch();
  },
  render: function render(initData) {
    var _this = this;

    this.model = new ItemCollectionModel({
      id: initData.id
    });

    this.fetch().then(function () {
      return _this.init();
    });

    this.intervalId = setInterval(function () {
      return _this.refresh();
    }, 3000);
  }
};
exports.ItemCollectionView = ItemCollectionView;

},{"../models/item_collection.js":3,"../templates/item_collection.html.js":6}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var OrgModel = require("../models/org.js").OrgModel;

// import {renderview} from './renderview.js';

var orgTemplate = require("../templates/org.html.js").orgTemplate;

var OrgView = {
  render: function render(org) {
    if (!this.orgModel) {
      this.orgModel = new OrgModel({
        name: org.name
      });
    }
    this.orgModel.fetch().then(function (data) {
      if (!this.ractive) {
        this.ractive = new Ractive({
          el: "#main-content-area",
          // template: '#org-content-template',
          template: orgTemplate,
          data: {
            name: data.name,
            item_collections: data.item_collections
          }
        });
        this.ractive.on("navigate", function (event, method) {
          // console.log(event.context.url);
          eventBus.trigger("navigate", event.context.url);
        });
      } else {
        this.ractive.render();
      }
    });
  }
};
exports.OrgView = OrgView;

},{"../models/org.js":4,"../templates/org.html.js":7}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IndexView = require("./index.js").IndexView;

var OrgView = require("./org.js").OrgView;

var ItemCollectionView = require("./item_collection.js").ItemCollectionView;

var Router = Backbone.Router.extend({
  routes: {
    "": "index",
    "o/:org": "org",
    "ic/:icId": "item_collection"
  },
  index: function index() {
    IndexView.render();
  },
  org: (function (_org) {
    var _orgWrapper = function org(_x) {
      return _org.apply(this, arguments);
    };

    _orgWrapper.toString = function () {
      return _org.toString();
    };

    return _orgWrapper;
  })(function (org) {
    OrgView.render({ name: org });
  }),
  item_collection: function item_collection(icId) {
    ItemCollectionView.render({ id: icId });
  }
});
exports.Router = Router;

},{"./index.js":8,"./item_collection.js":9,"./org.js":10}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9zaHJleWFzL2Rldi9oYXNnZWVrL2JveG9mZmljZS9ib3hvZmZpY2Uvc3RhdGljL2pzL3ZpZXdzL21haW4uanMiLCIvaG9tZS9zaHJleWFzL2Rldi9oYXNnZWVrL2JveG9mZmljZS9ib3hvZmZpY2Uvc3RhdGljL2pzL21vZGVscy9pbmRleC5qcyIsIi9ob21lL3NocmV5YXMvZGV2L2hhc2dlZWsvYm94b2ZmaWNlL2JveG9mZmljZS9zdGF0aWMvanMvbW9kZWxzL2l0ZW1fY29sbGVjdGlvbi5qcyIsIi9ob21lL3NocmV5YXMvZGV2L2hhc2dlZWsvYm94b2ZmaWNlL2JveG9mZmljZS9zdGF0aWMvanMvbW9kZWxzL29yZy5qcyIsIi9ob21lL3NocmV5YXMvZGV2L2hhc2dlZWsvYm94b2ZmaWNlL2JveG9mZmljZS9zdGF0aWMvanMvdGVtcGxhdGVzL2luZGV4Lmh0bWwuanMiLCIvaG9tZS9zaHJleWFzL2Rldi9oYXNnZWVrL2JveG9mZmljZS9ib3hvZmZpY2Uvc3RhdGljL2pzL3RlbXBsYXRlcy9pdGVtX2NvbGxlY3Rpb24uaHRtbC5qcyIsIi9ob21lL3NocmV5YXMvZGV2L2hhc2dlZWsvYm94b2ZmaWNlL2JveG9mZmljZS9zdGF0aWMvanMvdGVtcGxhdGVzL29yZy5odG1sLmpzIiwiL2hvbWUvc2hyZXlhcy9kZXYvaGFzZ2Vlay9ib3hvZmZpY2UvYm94b2ZmaWNlL3N0YXRpYy9qcy92aWV3cy9pbmRleC5qcyIsIi9ob21lL3NocmV5YXMvZGV2L2hhc2dlZWsvYm94b2ZmaWNlL2JveG9mZmljZS9zdGF0aWMvanMvdmlld3MvaXRlbV9jb2xsZWN0aW9uLmpzIiwiL2hvbWUvc2hyZXlhcy9kZXYvaGFzZ2Vlay9ib3hvZmZpY2UvYm94b2ZmaWNlL3N0YXRpYy9qcy92aWV3cy9vcmcuanMiLCIvaG9tZS9zaHJleWFzL2Rldi9oYXNnZWVrL2JveG9mZmljZS9ib3hvZmZpY2Uvc3RhdGlj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QUE7QUFDRCxpQkFBZSxFQUFFLHlCQUFTLElBQUksRUFBQztBQUM3QixzQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBQyxFQUFFLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztHQUN2QztDQUNGLENBQUMsQ0FBQztRQWZVLE1BQU0sR0FBTixNQUFNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJy4vcm91dGVyJztcblxuXG4kKGZ1bmN0aW9uKCl7XG4gIGxldCBhcHBSb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG4gIEJhY2tib25lLmhpc3Rvcnkuc3RhcnQoe3B1c2hTdGF0ZTogdHJ1ZSwgcm9vdDogXCIvYWRtaW4vXCJ9KTtcbiAgd2luZG93LmV2ZW50QnVzID0gXy5jbG9uZShCYWNrYm9uZS5FdmVudHMpO1xuICB3aW5kb3cuZXZlbnRCdXMub24oJ25hdmlnYXRlJywgZnVuY3Rpb24obXNnKXtcbiAgICBhcHBSb3V0ZXIubmF2aWdhdGUobXNnLCB7dHJpZ2dlcjogdHJ1ZX0pO1xuICB9KVxufSk7XG5cbiIsIlxuZXhwb3J0IGNvbnN0IEluZGV4TW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICB1cmwgOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAnL2FkbWluL2Rhc2hib2FyZCc7XG4gIH1cbn0pO1xuIiwiXG5leHBvcnQgY29uc3QgSXRlbUNvbGxlY3Rpb25Nb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybCA6IGZ1bmN0aW9uKGlkKXtcbiAgICByZXR1cm4gJy9hZG1pbi9pYy8nICsgdGhpcy5nZXQoJ2lkJyk7XG4gIH1cbn0pO1xuIiwiXG5leHBvcnQgY29uc3QgT3JnTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICB1cmwgOiBmdW5jdGlvbihuYW1lKXtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmdldCgnbmFtZScpKTtcbiAgICByZXR1cm4gJy9hZG1pbi9vLycgKyB0aGlzLmdldCgnbmFtZScpO1xuICB9XG59KTtcbiIsImV4cG9ydCBjb25zdCBJbmRleFRlbXBsYXRlID0gYFxuICB7eyNvcmdzfX1cbiAgICA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgb24tY2xpY2s9XCJuYXZpZ2F0ZVwiPnt7dGl0bGV9fTwvYT5cbiAge3svfX1cbmBcbiIsImV4cG9ydCBjb25zdCBUYWJsZVRlbXBsYXRlID0gYFxuICA8ZGl2IGNsYXNzPVwidGFibGUtcmVzcG9uc2l2ZSBzdGF0c1wiPlxuICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWhvdmVyIHN0YXRzLXRhYmxlXCI+XG4gICAgICA8dGhlYWQ+XG4gICAgICAgIDx0ciBjbGFzcz1cImluZm9cIj5cbiAgICAgICAgICA8dGg+IzwvdGg+XG4gICAgICAgICAgPHRoPkl0ZW08L3RoPlxuICAgICAgICAgIDx0aD5BdmFpbGFibGU8L3RoPlxuICAgICAgICAgIDx0aD5Tb2xkPC90aD5cbiAgICAgICAgICA8dGg+RnJlZTwvdGg+XG4gICAgICAgICAgPHRoPkNhbmNlbGxlZDwvdGg+XG4gICAgICAgICAgPHRoPkN1cnJlbnQgUHJpY2U8L3RoPlxuICAgICAgICAgIDx0aD5OZXQgU2FsZXM8L3RoPlxuICAgICAgICA8L3RyPlxuICAgICAgPC90aGVhZD5cbiAgICAgIDx0Ym9keT5cbiAgICAgICAge3sjaXRlbXN9fVxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0ZD57eyBAaW5kZXggKyAxIH19PC90ZD5cbiAgICAgICAgICAgIDx0ZD57eyB0aXRsZSB9fTwvdGQ+XG4gICAgICAgICAgICA8dGQ+e3sgYXZhaWxhYmxlIH19PC90ZD5cbiAgICAgICAgICAgIDx0ZD57eyBzb2xkIH19PC90ZD5cbiAgICAgICAgICAgIDx0ZD57eyBmcmVlIH19PC90ZD5cbiAgICAgICAgICAgIDx0ZD57eyBjYW5jZWxsZWQgfX08L3RkPlxuICAgICAgICAgICAgPHRkPnt7IGN1cnJlbnRfcHJpY2UgfX08L3RkPlxuICAgICAgICAgICAgPHRkPnt7IG5ldF9zYWxlcyB9fTwvdGQ+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAge3svfX1cbiAgICAgIDwvdGJvZHk+XG4gICAgPC90YWJsZT5cbiAgPC9kaXY+XG5gXG5cbmV4cG9ydCBjb25zdCBBZ2dDaGFydFRlbXBsYXRlID0gYFxuICA8ZGl2IGlkPVwiY2hhcnRcIiBjbGFzcz1cImMzXCIgc3R5bGU9XCJtYXgtaGVpZ2h0OiAyODBweDsgcG9zaXRpb246IHJlbGF0aXZlO1wiPlxuICA8L2Rpdj5cbmBcblxuZXhwb3J0IGNvbnN0IEl0ZW1Db2xsZWN0aW9uVGVtcGxhdGUgPSBgXG4gIDxicj5cbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNFwiPlxuICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICA8aDMgY2xhc3M9XCJwYW5lbC10aXRsZVwiPk5ldCBTYWxlczwvaDM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgIHt7bmV0X3NhbGVzfX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxocj5cbiAgPEFnZ0NoYXJ0Q29tcG9uZW50PjwvQWdnQ2hhcnRDb21wb25lbnQ+XG4gIDxocj5cbiAgPFRhYmxlQ29tcG9uZW50PjwvVGFibGVDb21wb25lbnQ+XG5gXG4iLCJleHBvcnQgY29uc3Qgb3JnVGVtcGxhdGUgPSBgXG4gIDx1bD5cbiAgICB7eyNpdGVtX2NvbGxlY3Rpb25zfX1cbiAgICAgIDxsaT5cbiAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIG9uLWNsaWNrPVwibmF2aWdhdGVcIj57e3RpdGxlfX08L2E+XG4gICAgICA8L2xpPlxuICAgIHt7L319XG4gIDwvdWw+XG5gXG4iLCJcbmltcG9ydCB7SW5kZXhNb2RlbH0gZnJvbSAnLi4vbW9kZWxzL2luZGV4LmpzJztcbmltcG9ydCB7SW5kZXhUZW1wbGF0ZX0gZnJvbSAnLi4vdGVtcGxhdGVzL2luZGV4Lmh0bWwuanMnO1xuXG5leHBvcnQgY29uc3QgSW5kZXhWaWV3ID0ge1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCF0aGlzLnJhY3RpdmUpO1xuICAgIGlmICghdGhpcy5pbmRleE1vZGVsKSB7XG4gICAgICB0aGlzLmluZGV4TW9kZWwgPSBuZXcgSW5kZXhNb2RlbCgpO1xuICAgIH1cbiAgICB0aGlzLmluZGV4TW9kZWwuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgaWYgKCF0aGlzLnJhY3RpdmUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJyYWN0aXZlXCIpXG4gICAgICAgIHRoaXMucmFjdGl2ZSA9IG5ldyBSYWN0aXZlKHtcbiAgICAgICAgICBlbDogJyNtYWluLWNvbnRlbnQtYXJlYScsXG4gICAgICAgICAgdGVtcGxhdGU6IEluZGV4VGVtcGxhdGUsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgb3JnczogZGF0YS5vcmdzXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yYWN0aXZlLm9uKCduYXZpZ2F0ZScsIGZ1bmN0aW9uKGV2ZW50LCBtZXRob2Qpe1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50LmNvbnRleHQudXJsKTtcbiAgICAgICAgICBldmVudEJ1cy50cmlnZ2VyKCduYXZpZ2F0ZScsIGV2ZW50LmNvbnRleHQudXJsKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJhY3RpdmUucmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIiwiXG5pbXBvcnQge0l0ZW1Db2xsZWN0aW9uTW9kZWx9IGZyb20gJy4uL21vZGVscy9pdGVtX2NvbGxlY3Rpb24uanMnO1xuaW1wb3J0IHtUYWJsZVRlbXBsYXRlLCBBZ2dDaGFydFRlbXBsYXRlLCBJdGVtQ29sbGVjdGlvblRlbXBsYXRlfSBmcm9tICcuLi90ZW1wbGF0ZXMvaXRlbV9jb2xsZWN0aW9uLmh0bWwuanMnO1xuXG4vLyBDb21wb25lbnRzXG4vLyB0YWJsZVxuLy8gY2hhcnRcblxubGV0IFRhYmxlQ29tcG9uZW50ID0gUmFjdGl2ZS5leHRlbmQoe1xuICBpc29sYXRlZDogZmFsc2UsXG4gIHRlbXBsYXRlOiBUYWJsZVRlbXBsYXRlXG59KTtcblxubGV0IEFnZ0NoYXJ0Q29tcG9uZW50ID0gUmFjdGl2ZS5leHRlbmQoe1xuICB0ZW1wbGF0ZTogQWdnQ2hhcnRUZW1wbGF0ZSxcbiAgb25jb21wbGV0ZTogZnVuY3Rpb24oKXtcbiAgICBsZXQgZGF0ZV9pdGVtX2NvdW50cyA9IHRoaXMucGFyZW50LmdldCgnZGF0ZV9pdGVtX2NvdW50cycpO1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5wYXJlbnQuZ2V0KCdpdGVtcycpO1xuICAgIGNvbnN0IGRhdGVfc2FsZXMgPSB0aGlzLnBhcmVudC5nZXQoJ2RhdGVfc2FsZXMnKTtcbiAgICBsZXQgZGF0ZXMgPSBbJ3gnXTtcbiAgICBsZXQgaXRlbV9jb3VudHMgPSB7fVxuICAgIGxldCBkYXRlX3NhbGVzX2NvbHVtbiA9IFsnZGF0ZV9zYWxlcyddXG4gICAgZm9yIChsZXQgaXRlbV9kYXRlIGluIGRhdGVfaXRlbV9jb3VudHMpIHtcbiAgICAgIGRhdGVzLnB1c2goaXRlbV9kYXRlKTtcbiAgICAgIGRhdGVfc2FsZXNfY29sdW1uLnB1c2goZGF0ZV9zYWxlc1tpdGVtX2RhdGVdKTtcbiAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKCFpdGVtX2NvdW50c1tpdGVtLmlkXSkge1xuICAgICAgICAgIGl0ZW1fY291bnRzW2l0ZW0uaWRdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGVfaXRlbV9jb3VudHNbaXRlbV9kYXRlXS5oYXNPd25Qcm9wZXJ0eShpdGVtLmlkKSkge1xuICAgICAgICAgIC8vIElmIGFuIGl0ZW0gaGFzIGJlZW4gYm91Z2h0IG9uIHRoaXMgaXRlbV9kYXRlXG4gICAgICAgICAgaXRlbV9jb3VudHNbaXRlbS5pZF0ucHVzaChkYXRlX2l0ZW1fY291bnRzW2l0ZW1fZGF0ZV1baXRlbS5pZF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEl0ZW0gbm90IGJvdWdodCBvbiB0aGlzIGRhdGVcbiAgICAgICAgICBpdGVtX2NvdW50c1tpdGVtLmlkXS5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGxldCBjb2x1bW5zID0gW2RhdGVzXTtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PntcbiAgICAgIGNvbHVtbnMucHVzaChbaXRlbS50aXRsZV0uY29uY2F0KGl0ZW1fY291bnRzW2l0ZW0uaWRdKSk7XG4gICAgfSlcbiAgICBcbiAgICBsZXQgYmFyX2dyYXBoX2hlYWRlcnMgPSBjb2x1bW5zLm1hcCgoY29sKSA9PiBjb2xbMF0pLmZpbHRlcigoaGVhZGVyKSA9PiBoZWFkZXIgIT09ICd4Jyk7XG4gICAgXG4gICAgY29sdW1ucy5wdXNoKGRhdGVfc2FsZXNfY29sdW1uKTtcblxuICAgIHRoaXMuY2hhcnQgPSBjMy5nZW5lcmF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHg6ICd4JyxcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgIHR5cGVzOiB7XG4gICAgICAgICAgZGF0ZV9zYWxlczogJ2xpbmUnXG4gICAgICAgIH0sXG4gICAgICAgIGdyb3VwczogW1xuICAgICAgICAgIGJhcl9ncmFwaF9oZWFkZXJzXG4gICAgICAgIF0sXG4gICAgICAgIGF4ZXM6IHtcbiAgICAgICAgICBkYXRlX3NhbGVzOiAneTInXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBiYXI6IHtcbiAgICAgICAgd2lkdGg6IHtcbiAgICAgICAgICByYXRpbzogMC41IC8vIHRoaXMgbWFrZXMgYmFyIHdpZHRoIDUwJSBvZiBsZW5ndGggYmV0d2VlbiB0aWNrc1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYXhpczoge1xuICAgICAgICB4OiB7XG4gICAgICAgICAgdHlwZTogJ3RpbWVzZXJpZXMnLFxuICAgICAgICAgIHRpY2s6IHtcbiAgICAgICAgICAgIGZvcm1hdDogJyVkLSVtJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgeTI6IHtcbiAgICAgICAgICBzaG93OiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSlcblxuZXhwb3J0IGNvbnN0IEl0ZW1Db2xsZWN0aW9uVmlldyA9IHtcbiAgaW5pdDogZnVuY3Rpb24oZGF0YSl7XG4gICAgdGhpcy5yYWN0aXZlID0gbmV3IFJhY3RpdmUoe1xuICAgICAgZWw6ICcjbWFpbi1jb250ZW50LWFyZWEnLFxuICAgICAgdGVtcGxhdGU6IEl0ZW1Db2xsZWN0aW9uVGVtcGxhdGUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGl0ZW1zOiB0aGlzLm1vZGVsLmdldCgnaXRlbXMnKSxcbiAgICAgICAgZGF0ZV9pdGVtX2NvdW50czogdGhpcy5tb2RlbC5nZXQoJ2RhdGVfaXRlbV9jb3VudHMnKSxcbiAgICAgICAgZGF0ZV9zYWxlczogdGhpcy5tb2RlbC5nZXQoJ2RhdGVfc2FsZXMnKSxcbiAgICAgICAgbmV0X3NhbGVzOiB0aGlzLm1vZGVsLmdldCgnbmV0X3NhbGVzJylcbiAgICAgIH0sXG4gICAgICBjb21wb25lbnRzOiB7VGFibGVDb21wb25lbnQ6IFRhYmxlQ29tcG9uZW50LCBBZ2dDaGFydENvbXBvbmVudDogQWdnQ2hhcnRDb21wb25lbnR9XG4gICAgfSk7XG5cbiAgICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2U6aXRlbXMnLCAobW9kZWwsIGl0ZW1zKSA9PiB0aGlzLnJhY3RpdmUuc2V0KCdpdGVtcycsIGl0ZW1zKSk7XG5cbiAgICB0aGlzLnJhY3RpdmUub24oJ25hdmlnYXRlJywgZnVuY3Rpb24oZXZlbnQsIG1ldGhvZCl7XG4gICAgICAvLyBraWxsIGludGVydmFsXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxJZCk7XG4gICAgICBldmVudEJ1cy50cmlnZ2VyKCduYXZpZ2F0ZScsIGV2ZW50LmNvbnRleHQudXJsKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoZXZlbnQpID0+IHtcbiAgICAgIC8vIGtpbGwgaW50ZXJ2YWxcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbElkKTtcbiAgICB9KTtcbiAgfSxcbiAgZmV0Y2g6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwuZmV0Y2goKS50aGVuKGRhdGEgPT4ge1xuICAgICAgdGhpcy5tb2RlbC5zZXQoJ2l0ZW1zJywgZGF0YS5pdGVtcyk7XG4gICAgICB0aGlzLm1vZGVsLnNldCgnZGF0ZV9pdGVtX2NvdW50cycsIGRhdGEuZGF0ZV9pdGVtX2NvdW50cyk7XG4gICAgICB0aGlzLm1vZGVsLnNldCgnZGF0ZV9zYWxlcycsIGRhdGEuZGF0ZV9zYWxlcyk7XG4gICAgICB0aGlzLm1vZGVsLnNldCgnbmV0X3NhbGVzJywgZGF0YS5uZXRfc2FsZXMpO1xuICAgIH0pO1xuICB9LFxuICByZWZyZXNoOiBmdW5jdGlvbigpe1xuICAgIHRoaXMuZmV0Y2goKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbihpbml0RGF0YSkge1xuICAgIHRoaXMubW9kZWwgPSBuZXcgSXRlbUNvbGxlY3Rpb25Nb2RlbCh7XG4gICAgICBpZDogaW5pdERhdGEuaWRcbiAgICB9KTtcblxuICAgIHRoaXMuZmV0Y2goKS50aGVuKCgpID0+IHRoaXMuaW5pdCgpKTtcblxuICAgIHRoaXMuaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHRoaXMucmVmcmVzaCgpLCAzMDAwKTtcbiAgfVxufVxuIiwiXG5pbXBvcnQge09yZ01vZGVsfSBmcm9tICcuLi9tb2RlbHMvb3JnLmpzJztcbi8vIGltcG9ydCB7cmVuZGVydmlld30gZnJvbSAnLi9yZW5kZXJ2aWV3LmpzJztcbmltcG9ydCB7b3JnVGVtcGxhdGV9IGZyb20gJy4uL3RlbXBsYXRlcy9vcmcuaHRtbC5qcyc7XG5cbmV4cG9ydCBjb25zdCBPcmdWaWV3ID0ge1xuICByZW5kZXI6IGZ1bmN0aW9uKG9yZykge1xuICAgIGlmICghdGhpcy5vcmdNb2RlbCkge1xuICAgICAgdGhpcy5vcmdNb2RlbCA9IG5ldyBPcmdNb2RlbCh7XG4gICAgICAgIG5hbWU6IG9yZy5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5vcmdNb2RlbC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICBpZiAoIXRoaXMucmFjdGl2ZSkge1xuICAgICAgICB0aGlzLnJhY3RpdmUgPSBuZXcgUmFjdGl2ZSh7XG4gICAgICAgICAgZWw6ICcjbWFpbi1jb250ZW50LWFyZWEnLFxuICAgICAgICAgIC8vIHRlbXBsYXRlOiAnI29yZy1jb250ZW50LXRlbXBsYXRlJyxcbiAgICAgICAgICB0ZW1wbGF0ZTogb3JnVGVtcGxhdGUsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgICAgICAgaXRlbV9jb2xsZWN0aW9uczogZGF0YS5pdGVtX2NvbGxlY3Rpb25zXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yYWN0aXZlLm9uKCduYXZpZ2F0ZScsIGZ1bmN0aW9uKGV2ZW50LCBtZXRob2Qpe1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50LmNvbnRleHQudXJsKTtcbiAgICAgICAgICBldmVudEJ1cy50cmlnZ2VyKCduYXZpZ2F0ZScsIGV2ZW50LmNvbnRleHQudXJsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmFjdGl2ZS5yZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG59XG4iLCJcbmltcG9ydCB7SW5kZXhWaWV3fSBmcm9tICcuL2luZGV4LmpzJztcbmltcG9ydCB7T3JnVmlld30gZnJvbSAnLi9vcmcuanMnO1xuaW1wb3J0IHtJdGVtQ29sbGVjdGlvblZpZXd9IGZyb20gJy4vaXRlbV9jb2xsZWN0aW9uLmpzJztcblxuZXhwb3J0IGNvbnN0IFJvdXRlciA9IEJhY2tib25lLlJvdXRlci5leHRlbmQoe1xuICByb3V0ZXM6IHtcbiAgICBcIlwiOiBcImluZGV4XCIsXG4gICAgXCJvLzpvcmdcIjogXCJvcmdcIixcbiAgICBcImljLzppY0lkXCI6IFwiaXRlbV9jb2xsZWN0aW9uXCJcbiAgfSxcbiAgaW5kZXg6IGZ1bmN0aW9uKCkge1xuICAgIEluZGV4Vmlldy5yZW5kZXIoKTtcbiAgfSxcbiAgb3JnOiBmdW5jdGlvbihvcmcpe1xuICAgIE9yZ1ZpZXcucmVuZGVyKHtuYW1lOiBvcmd9KTtcbiAgfSxcbiAgaXRlbV9jb2xsZWN0aW9uOiBmdW5jdGlvbihpY0lkKXtcbiAgICBJdGVtQ29sbGVjdGlvblZpZXcucmVuZGVyKHtpZDogaWNJZH0pO1xuICB9XG59KTtcbiJdfQ==
