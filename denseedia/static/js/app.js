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

        _this2.state = { edium: { name: "NamePlaceholder", kind: "KindPlaceholder" } };
        return _this2;
    }

    _createClass(HalfPanel, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "HalfPanel" },
                React.createElement(EdiaSelect, null),
                React.createElement(EdiumDisplay, { edium: this.state.edium })
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

        _this3.state = { val: "", selected: 0 };
        _this3.on_change = _this3.on_change.bind(_this3);
        _this3.clean = _this3.clean.bind(_this3);
        return _this3;
    }

    _createClass(EdiaSelect, [{
        key: "on_change",
        value: function on_change(event) {
            var value = event.target.value;
            var try_parse = parseInt(value.split(" ")[0]);
            if (isNaN(try_parse)) {
                try_parse = 0;
            }

            this.setState({
                val: value,
                selected: try_parse
            });
        }
    }, {
        key: "clean",
        value: function clean() {
            this.setState({
                val: "",
                selected: 0
            });
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

        _this4.state = { edium: props.edium };
        return _this4;
    }

    _createClass(EdiumDisplay, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "EdiumDisplay" },
                React.createElement(
                    "h2",
                    null,
                    this.state.edium.name + " (" + this.state.edium.kind + ")"
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

        var _this5 = _possibleConstructorReturn(this, (EdiaDatalist.__proto__ || Object.getPrototypeOf(EdiaDatalist)).call(this, props));

        _this5.state = { edia: [] };
        return _this5;
    }

    _createClass(EdiaDatalist, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this6 = this;

            console.log("Fetching edia list...");
            ajax_request("/edia", "GET", function (res) {
                _this6.setState({ edia: res });
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
                        value: e.id + " : " + (e.name ? e.name : "#") + " (" + e.kind + ")"
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