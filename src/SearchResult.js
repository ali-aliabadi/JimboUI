import React, {Component} from "react";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import { progressBarFetch, setOriginalFetch } from 'react-fetch-progressbar';
import { ProgressBar } from 'react-fetch-progressbar';
import Header from "./components/header";

setOriginalFetch(window.fetch);
window.fetch = progressBarFetch;

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: SearchResult.parseQuery(this.props.location.search),
            items: [],
            searchTime: -1,
            resultCount: 0
        };
        this.searchQuery = this.state.query;
        this.search = this.search.bind(this);
    }

    static parseQuery(queryString) {
        let query = {};
        let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query.q;
    }

    render = () => {
        return (
            <div>
                <ProgressBar style={{backgroundColor: "black"}}/>
                <Header searchField={true}/>
                <div className={"search-items"}>
                    <div className={"search-item"}>
                        <small>
                            {this.state.searchTime === -1 ? "" : "About " + this.state.resultCount + " results in " + this.state.searchTime + " seconds"}
                        </small>
                    </div>
                    {
                        this.state.items.map(item => (
                                <div className={"search-item"}>
                                    <a className={"search-item-title"} href={item.url}>{item.title}</a><br/>
                                    <a className={"search-item-url"} href={item.url}>{SearchResult.uriShow(item.url)}</a><br/>
                                    <span className={"search-item-text"} dangerouslySetInnerHTML={{__html: item.text}}></span>
                                </div>
                            )
                        )
                    }
                </div>

            </div>
        );
    };

    search() {
        var url = "http://localhost:8000/?q=" + this.searchQuery;
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    query: this.searchQuery,
                    items: data.items,
                    searchTime: data.searchTime,
                    resultCount: data.resultCount
                });
                this.props.history.push("/search?q=" + this.searchQuery);
            })
            .catch(console.log)
    }

    static uriShow(uri) {
        let decode_uri = decodeURIComponent(uri);
        if(decode_uri.length > 100)
            decode_uri = decode_uri.substr(0, 100) + "...";
        return decode_uri;
    }

    keyDown(e) {
        if (e.key === 'Enter')
            this.search();
    }

    componentDidMount() {
        this.search()
    }
}

export default SearchResult;
