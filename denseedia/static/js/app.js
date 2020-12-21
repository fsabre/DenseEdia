var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "App" },
                React.createElement(
                    "h1",
                    null,
                    "DenseEdia - Main page"
                ),
                React.createElement(HalfPanel, null),
                React.createElement(HalfPanel, null),
                React.createElement(EdiaDatalist, null)
            );
        }
    }]);

    return App;
}(React.Component);

var HalfPanel = function (_React$Component2) {
    _inherits(HalfPanel, _React$Component2);

    function HalfPanel(props) {
        _classCallCheck(this, HalfPanel);

        var _this2 = _possibleConstructorReturn(this, (HalfPanel.__proto__ || Object.getPrototypeOf(HalfPanel)).call(this, props));

        _this2.state = { selected_edium: 0 };
        _this2.on_edium_select = _this2.on_edium_select.bind(_this2);
        return _this2;
    }

    _createClass(HalfPanel, [{
        key: "on_edium_select",
        value: function on_edium_select(edium_id) {
            this.setState({ selected_edium: edium_id });
        }
    }, {
        key: "render",
        value: function render() {
            var edium_id = this.state.selected_edium;
            return React.createElement(
                "div",
                { className: "HalfPanel" },
                React.createElement(EdiaSelect, { on_edium_select: this.on_edium_select }),
                edium_id !== 0 ? React.createElement(EdiumDisplay, { edium_id: edium_id }) : React.createElement(BlankEdiumDisplay, null)
            );
        }
    }]);

    return HalfPanel;
}(React.Component);

var EdiaSelect = function (_React$Component3) {
    _inherits(EdiaSelect, _React$Component3);

    function EdiaSelect(props) {
        _classCallCheck(this, EdiaSelect);

        var _this3 = _possibleConstructorReturn(this, (EdiaSelect.__proto__ || Object.getPrototypeOf(EdiaSelect)).call(this, props));

        _this3.state = { val: "" };
        _this3.on_change = _this3.on_change.bind(_this3);
        _this3.clean = _this3.clean.bind(_this3);
        return _this3;
    }

    _createClass(EdiaSelect, [{
        key: "on_change",
        value: function on_change(event) {
            var raw_value = event.target.value;
            var new_id = parseInt(raw_value.split(" ")[0]);
            if (isNaN(new_id)) {
                new_id = 0;
            }
            this.props.on_edium_select(new_id);
            this.setState({ val: raw_value });
        }
    }, {
        key: "clean",
        value: function clean() {
            this.setState({ val: "" });
            this.props.on_edium_select(0);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "EdiaSelect" },
                React.createElement("input", {
                    type: "text",
                    list: "edia-datalist",
                    value: this.state.val,
                    onChange: this.on_change
                }),
                React.createElement("input", { type: "button", value: "Clear", onClick: this.clean })
            );
        }
    }]);

    return EdiaSelect;
}(React.Component);

var EdiumDisplay = function (_React$Component4) {
    _inherits(EdiumDisplay, _React$Component4);

    function EdiumDisplay(props) {
        _classCallCheck(this, EdiumDisplay);

        var _this4 = _possibleConstructorReturn(this, (EdiumDisplay.__proto__ || Object.getPrototypeOf(EdiumDisplay)).call(this, props));

        _this4.state = { loading: true, edium: {}, elements: [] };
        _this4.fetch_content();
        return _this4;
    }

    _createClass(EdiumDisplay, [{
        key: "fetch_content",
        value: function fetch_content() {
            var _this5 = this;

            console.log("Fetching Edium n\xB0" + this.props.edium_id);
            var edium_promise = ajax_promise("/edia/" + this.props.edium_id, "GET");
            var elements_promise = ajax_promise("/edia/" + this.props.edium_id + "/elements", "GET");
            Promise.all([edium_promise, elements_promise]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    res1 = _ref2[0],
                    res2 = _ref2[1];

                console.log("Done. (both requests)");
                _this5.setState({ loading: false, edium: res1, elements: res2 });
            });
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prev_props) {
            if (this.props.edium_id != prev_props.edium_id) {
                this.fetch_content();
            }
        }
    }, {
        key: "render",
        value: function render() {
            if (this.state.loading) {
                return React.createElement(Loading, null);
            }

            var edium = this.state.edium;

            return React.createElement(
                "div",
                { className: "EdiumDisplay" },
                React.createElement(
                    "h2",
                    null,
                    "Edium n\xB0",
                    edium.id,
                    " : ",
                    edium.name ? edium.name : "#",
                    " (",
                    edium.kind,
                    ")"
                ),
                React.createElement(
                    "table",
                    null,
                    React.createElement(
                        "thead",
                        null,
                        React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "th",
                                null,
                                "Element name"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Value"
                            )
                        )
                    ),
                    React.createElement(
                        "tbody",
                        null,
                        this.state.elements.map(function (e) {
                            return React.createElement(ElementDisplay, {
                                key: e.id,
                                name: e.name,
                                value: e.value });
                        })
                    )
                )
            );
        }
    }]);

    return EdiumDisplay;
}(React.Component);

var ElementDisplay = function (_React$Component5) {
    _inherits(ElementDisplay, _React$Component5);

    function ElementDisplay() {
        _classCallCheck(this, ElementDisplay);

        return _possibleConstructorReturn(this, (ElementDisplay.__proto__ || Object.getPrototypeOf(ElementDisplay)).apply(this, arguments));
    }

    _createClass(ElementDisplay, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "tr",
                { className: "ElementDisplay" },
                React.createElement(
                    "td",
                    null,
                    React.createElement("input", { type: "text", readOnly: true, value: this.props.name })
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement("input", { type: "text", readOnly: true, value: this.props.value })
                )
            );
        }
    }]);

    return ElementDisplay;
}(React.Component);

var BlankEdiumDisplay = function (_React$Component6) {
    _inherits(BlankEdiumDisplay, _React$Component6);

    function BlankEdiumDisplay() {
        _classCallCheck(this, BlankEdiumDisplay);

        return _possibleConstructorReturn(this, (BlankEdiumDisplay.__proto__ || Object.getPrototypeOf(BlankEdiumDisplay)).apply(this, arguments));
    }

    _createClass(BlankEdiumDisplay, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "BlankEdiumDisplay" },
                React.createElement(
                    "h2",
                    null,
                    "No Edium"
                ),
                React.createElement(
                    "p",
                    null,
                    "No elements"
                )
            );
        }
    }]);

    return BlankEdiumDisplay;
}(React.Component);

var EdiaDatalist = function (_React$Component7) {
    _inherits(EdiaDatalist, _React$Component7);

    function EdiaDatalist(props) {
        _classCallCheck(this, EdiaDatalist);

        var _this8 = _possibleConstructorReturn(this, (EdiaDatalist.__proto__ || Object.getPrototypeOf(EdiaDatalist)).call(this, props));

        _this8.state = { loading: true, edia: [] };
        return _this8;
    }

    _createClass(EdiaDatalist, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this9 = this;

            console.log("Fetching edia list...");
            ajax_promise("/edia", "GET").then(function (res) {
                console.log("Done.");
                _this9.setState({ loading: false, edia: res });
            });
        }
    }, {
        key: "render",
        value: function render() {
            if (this.state.loading) {
                return React.createElement(Loading, null);
            }

            return React.createElement(
                "datalist",
                { className: "EdiaDatalist", id: "edia-datalist" },
                this.state.edia.map(function (e) {
                    return React.createElement("option", {
                        key: e.id,
                        value: e.id + " " + (e.name ? e.name : '#') + " (" + e.kind + ")"
                    });
                })
            );
        }
    }]);

    return EdiaDatalist;
}(React.Component);

var Loading = function (_React$Component8) {
    _inherits(Loading, _React$Component8);

    function Loading() {
        _classCallCheck(this, Loading);

        return _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).apply(this, arguments));
    }

    _createClass(Loading, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "Loading" },
                React.createElement(
                    "p",
                    null,
                    "I'm loading right now."
                )
            );
        }
    }]);

    return Loading;
}(React.Component);

function ajax_promise(url, method) {
    return fetch(url, { method: method }).then(function (response) {
        return response.json();
    });
}