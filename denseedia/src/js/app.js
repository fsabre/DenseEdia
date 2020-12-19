class App extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="App">
                <h1>DenseEdia - Main page</h1>
                <HalfPanel />
                <HalfPanel />
                <EdiaDatalist />
            </div>
        );
    }
}


class HalfPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {edium: {name: "NamePlaceholder", kind: "KindPlaceholder"}};
    }

    render(){
        return (
            <div className="HalfPanel">
                <EdiaSelect />
                <EdiumDisplay edium={this.state.edium}/>
            </div>
        );
    }
}

class EdiaSelect extends React.Component{
    constructor(props){
        super(props);
        this.state = {val: "", selected: 0};
        this.on_change = this.on_change.bind(this);
        this.clean = this.clean.bind(this);
    }

    on_change(event){
        const value = event.target.value;
        let try_parse = parseInt(value.split(" ")[0]);
        if(isNaN(try_parse)){
            try_parse = 0;
        }

        this.setState({
            val: value,
            selected: try_parse
        });
    }

    clean(){
        this.setState({
            val: "",
            selected: 0
        });
    }

    render(){
        return (
            <div className="EdiaSelect">
                <input
                    type="text"
                    list="edia-datalist"
                    value={this.state.val}
                    onChange={this.on_change}
                />
                <input type="button" value="Clear" onClick={this.clean}/>
            </div>
        );
    }
}

class EdiumDisplay extends React.Component{
    constructor(props){
        super(props);
        this.state = {edium: props.edium};
    }

    render(){
        return (
            <div className="EdiumDisplay">
                <h2>{`${this.state.edium.name} (${this.state.edium.kind})`}</h2>
                <p>There will be Elements here.</p>
            </div>
        );
    }
}


class EdiaDatalist extends React.Component{
    constructor(props){
        super(props);
        this.state = {edia: []};
    }

    componentDidMount(){
        console.log("Fetching edia list...");
        ajax_request(
            "/edia",
            "GET",
            (res) => {
                this.setState({edia: res})
             }
        );
        console.log("Done.");
    }

    render(){
        return (
            <datalist className="EdiaDatalist" id="edia-datalist">
                {
                    this.state.edia.map((e) => (
                        <option
                            key={e.id}
                            value={`${e.id} : ${e.name ? e.name : "#"} (${e.kind})`}
                        />
                    ))
                }
            </datalist>
        );
    }
}


function ajax_request(url, method, handle_response){
    fetch(
        url,
        { method: method }
    )
    .then(response => response.json())
    .then(handle_response)
    .catch(
        err => { console.log(`Error on request ${method} '${url}' : ${err}`); }
    );
}