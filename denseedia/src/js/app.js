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
        this.state = {val: ""};
        this.on_change = this.on_change.bind(this);
        this.clean = this.clean.bind(this);
    }

    on_change(event){
        this.setState({val: event.target.value});
    }

    clean(){
        this.setState({val: ""});
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
        this.state = {
            edia: [
                {id: 1, name: "Placeholder1"},
                {id: 2, name: "Placeholder2"},
                {id: 3, name: "Placeholder3"}
            ]
        };
    }

    render(){
        return (
            <datalist className="EdiaDatalist" id="edia-datalist">
                {this.state.edia.map((e) => <option key={e.id} value={e.name}/>)}
            </datalist>
        );
    }
}
