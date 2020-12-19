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
        this.state = {selected_edium: 0}
        this.on_edium_select = this.on_edium_select.bind(this);
    }

    on_edium_select(edium_id){
        this.setState({selected_edium: edium_id});
    }

    render(){
        return (
            <div className="HalfPanel">
                <EdiaSelect on_edium_select={this.on_edium_select}/>
                <EdiumDisplay edium_id={this.state.selected_edium}/>
            </div>
        );
    }
}

class EdiaSelect extends React.Component{
    constructor(props){
        super(props);
        this.state = {val: ""};
        this.on_change = this.on_change.bind(this);
        this.clean = this.clean.bind(this);
    }

    on_change(event){
        const raw_value = event.target.value;
        let new_id = parseInt(raw_value.split(" ")[0]);
        if(isNaN(new_id)) { new_id = 0; }
        this.props.on_edium_select(new_id);
        this.setState({val: raw_value});
    }

    clean(){
        this.setState({val: ""});
        this.props.on_edium_select(0);
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
        this.state = {edium: {}};
    }

    fetch_content(){
        if(this.props.edium_id != 0)
        {
            console.log(`Fetching Edium n°${this.props.edium_id}`);
            ajax_request(
                `/edia/${this.props.edium_id}`,
                "GET",
                (res) => {
                    this.setState({edium: res})
                }
            );
            console.log("Done.");
        }
    }

    componentDidUpdate(prev_props){
        if(this.props.edium_id != prev_props.edium_id){
            this.fetch_content();
        }
    }

    render(){
        const edium = this.state.edium;
        return (
            <div className="EdiumDisplay">
                {
                    this.props.edium_id == 0
                    ? <h2>No Edium</h2>
                    : <h2>Edium n°{edium.id} : {edium.name ? edium.name : "#"} ({edium.kind})</h2>
                }
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
                            value={`${e.id} ${e.name ? e.name : '#'} (${e.kind})`}
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
