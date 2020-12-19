var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));
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
            return React.createElement(
                "div",
                { className: "HalfPanel" },
                React.createElement(EdiaSelect, { on_edium_select: this.on_edium_select }),
                React.createElement(EdiumDisplay, { edium_id: this.state.selected_edium })
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

        _this4.state = { edium: {} };
        return _this4;
    }

    _createClass(EdiumDisplay, [{
        key: "fetch_content",
        value: function fetch_content() {
            var _this5 = this;

            if (this.props.edium_id != 0) {
                console.log("Fetching Edium n\xB0" + this.props.edium_id);
                ajax_request("/edia/" + this.props.edium_id, "GET", function (res) {
                    _this5.setState({ edium: res });
                });
                console.log("Done.");
            }
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
            var edium = this.state.edium;
            return React.createElement(
                "div",
                { className: "EdiumDisplay" },
                this.props.edium_id == 0 ? React.createElement(
                    "h2",
                    null,
                    "No Edium"
                ) : React.createElement(
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
                    "p",
                    null,
                    "There will be Elements here."
                )
            );
        }
    }]);

    return EdiumDisplay;
}(React.Component);

var EdiaDatalist = function (_React$Component5) {
    _inherits(EdiaDatalist, _React$Component5);

    function EdiaDatalist(props) {
        _classCallCheck(this, EdiaDatalist);

        var _this6 = _possibleConstructorReturn(this, (EdiaDatalist.__proto__ || Object.getPrototypeOf(EdiaDatalist)).call(this, props));

        _this6.state = { edia: [] };
        return _this6;
    }

    _createClass(EdiaDatalist, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this7 = this;

            console.log("Fetching edia list...");
            ajax_request("/edia", "GET", function (res) {
                _this7.setState({ edia: res });
            });
            console.log("Done.");
        }
    }, {
        key: "render",
        value: function render() {
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

function ajax_request(url, method, handle_response) {
    fetch(url, { method: method }).then(function (response) {
        return response.json();
    }).then(handle_response).catch(function (err) {
        console.log("Error on request " + method + " '" + url + "' : " + err);
    });
}