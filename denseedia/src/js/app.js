class App extends React.Component{
    render(){
        return (
            <div className="App w3-container">
                <h1>DenseEdia - Main page</h1>
                <div className="w3-row">
                    <HalfPanel />
                    <HalfPanel />
                </div>
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
        const edium_id = this.state.selected_edium;
        return (
            <div className="HalfPanel w3-container w3-col l6 w3-border">
                <EdiaSelect on_edium_select={this.on_edium_select}/>
                {
                    edium_id !== 0
                    ? <EdiumDisplay edium_id={edium_id}/>
                    : <BlankEdiumDisplay />
                }
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
            <div className="EdiaSelect w3-row">
                <h3>Select an Edia :</h3>
                <input
                    className="w3-col s10"
                    type="text"
                    list="edia-datalist"
                    value={this.state.val}
                    onChange={this.on_change}
                />
                <input
                    className="w3-col s2"
                    type="button"
                    value="Clear"
                    onClick={this.clean}
                />
            </div>
        );
    }
}

class EdiumDisplay extends React.Component{
    constructor(props){
        super(props);
        this.state = {loading: true, edium: {}, elements: []};
        this.fetch_content();
    }

    fetch_content(){
        console.log(`Fetching Edium n°${this.props.edium_id}`);
        const edium_promise = ajax_promise(`/edia/${this.props.edium_id}`, "GET");
        const elements_promise = ajax_promise(`/edia/${this.props.edium_id}/elements`, "GET");
        Promise.all([edium_promise, elements_promise]).then(
            ([res1, res2]) => {
                console.log("Done. (both requests)");
                this.setState({loading: false, edium: res1, elements: res2});
            }
        );
    }

    componentDidUpdate(prev_props){
        if(this.props.edium_id != prev_props.edium_id){
            this.fetch_content();
        }
    }

    render(){
        if(this.state.loading){
            return <Loading />;
        }

        const edium = this.state.edium;

        return (
            <div className="EdiumDisplay">
                <h2>Edium n°{edium.id} : {edium.name ? edium.name : "#"} ({edium.kind})</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Element name</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.elements.map((e) => {
                            return (
                                <ElementDisplay
                                key={e.id}
                                name={e.name}
                                value={e.value}/>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}


class ElementDisplay extends React.Component{
    render(){
        return (
            <tr className="ElementDisplay">
                <td><input type="text" readOnly value={this.props.name}/></td>
                <td><input type="text" readOnly value={this.props.value}/></td>
            </tr>
        );
    }
}


class BlankEdiumDisplay extends React.Component{
    render(){
        return (
            <div className="BlankEdiumDisplay">
                <h2>No Edium</h2>
                <p>No elements</p>
            </div>
        );
    }
}


class EdiaDatalist extends React.Component{
    constructor(props){
        super(props);
        this.state = {loading: true, edia: []};
    }

    componentDidMount(){
        console.log("Fetching edia list...");
        ajax_promise("/edia", "GET").then(
            (res) => {
                console.log("Done.");
                this.setState({loading: false, edia: res});
             }
        );
    }

    render(){
        if(this.state.loading){
            return <Loading />;
        }

        return (
            <datalist className="EdiaDatalist" id="edia-datalist">
                {
                    this.state.edia.map((e) => (
                        <option
                            key={e.id}
                            value={`${e.id} : ${e.name ? e.name : '#'} (${e.kind})`}
                        />
                    ))
                }
            </datalist>
        );
    }
}


class Loading extends React.Component{
    render(){
        return (
            <div className="Loading">
                <p>I'm loading right now.</p>
            </div>
        );
    }
}


function ajax_promise(url, method){
    return fetch(url, {method: method}).then(response => response.json());
}
