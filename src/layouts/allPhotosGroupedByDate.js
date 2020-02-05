import React, {Component} from 'react';
import { Card, Image, Header, Divider, Item, Loader, Dimmer,
         Container, Label, Popup, Segment, Button, Icon} from 'semantic-ui-react';
import Gallery from 'react-grid-gallery'
import VisibilitySensor from 'react-visibility-sensor'
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {simpleFetchPhotos} from '../actions/photosActions'
import { Map, TileLayer, Marker } from 'react-leaflet'
import {Server, serverAddress} from '../api_client/apiClient'
import {fetchDateAlbumsList} from '../actions/albumsActions'
import LazyLoad from 'react-lazyload';


        // <div style={{
        //     display: "block",
        //     minHeight: "1px",
        //     width: "100%",
        //     padding: '10px',
        //     overflowX: "hidden",
        //     overflowY: 'auto'}}>
        //   <Gallery 
        //     images={mappedRenderablePhotoArray}
        //     enableImageSelection={false}
        //     rowHeight={250}/>
        // </div>
var SIDEBAR_WIDTH = 8;

class ImagePlaceholder extends Component {
  render () {
    return (
      <div style={{height:this.props.size,width:this.props.size}}>
      </div>
    )
  }
}

export class AllPhotosGroupedByDate extends Component {
  constructor(props){
    super(props)
    this.groupPhotosByDate = this.groupPhotosByDate.bind(this)
    this.receivedAllProps = this.receivedAllProps.bind(this)
    this.calculateEntrySquareSize = this.calculateEntrySquareSize.bind(this)
    this.groupedPhotosToImageGrids = this.groupedPhotosToImageGrids.bind(this)
	this.getYear = this.getYear.bind(this);
	this.getMonth = this.getMonth.bind(this);
	this.searchDay=this.searchDay.bind(this);
  	this.setState({
	  year_txt : 13,
	  month_txt : 32,
          inputYear:13,
          inputMonth:32,
      width:  window.innerWidth,
      height: window.innerHeight,
      entrySquareSize:200
  	})
  }

  calculateEntrySquareSize() {
  	if (window.innerWidth < 600) {
  		var numEntrySquaresPerRow = 4
  	} 
    else if (window.innerWidth < 800) {
      var numEntrySquaresPerRow = 6
    }
  	else if (window.innerWidth < 1000) {
  		var numEntrySquaresPerRow = 8
  	}
    else if (window.innerWidth < 1200) {
      var numEntrySquaresPerRow = 10
    }
  	else {
  		var numEntrySquaresPerRow = 12
  	}

    var columnWidth = window.innerWidth - SIDEBAR_WIDTH - 5 - 5 - 15

    //console.log(columnWidth)
    var entrySquareSize = columnWidth / numEntrySquaresPerRow
    var numEntrySquaresPerRow = numEntrySquaresPerRow
  	this.setState({
      width:  window.innerWidth,
      height: window.innerHeight,
      entrySquareSize:entrySquareSize,
      numEntrySquaresPerRow:numEntrySquaresPerRow
  	})
  }

  receivedAllProps() {
    if (this.props.fetchedPhotos && 
        !this.props.photos.length==0 && 
        !this.props.fetchingPhotos &&
        this.props.fetchedPhotos) {

      /*console.log("fetchedPhotos",this.props.fetchedPhotos)
      console.log("photos",this.props.photos.length)
      console.log("fetchingPhotos",this.props.fetchingPhotos)
      console.log("fetchedPhotos",this.props.fetchedPhotos)
      console.log("albumsDateList",this.props.albumsDateList.length)
      console.log("fetchingAlbumsDateList",this.props.fetchingAlbumsDateList)
      console.log("fetchedAlbumsDateList",this.props.fetchedAlbumsDateList)*/


      return true
    }
    else {
      return false
    }
  }

  componentWillMount() {
    this.props.dispatch(simpleFetchPhotos())
    this.calculateEntrySquareSize();
    window.addEventListener("resize", this.calculateEntrySquareSize.bind(this));
  }

  groupPhotosByDate() {
    var photosGroupedByDate = {}
    photosGroupedByDate['Unknown Date'] = []

	const curYear = this.state.year_txt;
	const curMonth = this.state.month_txt;

    this.props.photos.map(function(photo){
      if (photo.exif_timestamp != null) {
        var date = photo.exif_timestamp.split('T')[0]
		var year = date.substring(0,4)
		var month = date.substring(5,7)
		alert(curYear, curMonth)
		/*if(photosGroupedByDate.hasOwnProperty(date)){
			photosGroupedByDate[date] = []
			
		}*/
		if(curYear == 13 && curMonth == 32){
			photosGroupedByDate[date] = []
				photosGroupedByDate[date].push(photo)
		} else if(curYear == year && curMonth == 32){
				photosGroupedByDate[date] = []
				photosGroupedByDate[date].push(photo)
		} else if(curYear == 13 && curMonth == month){
				photosGroupedByDate[date] = []
				photosGroupedByDate[date].push(photo)
		} else if(curYear == year && curMonth == month){
				photosGroupedByDate[date] = []
				photosGroupedByDate[date].push(photo)
		}

      }
      else {
        photosGroupedByDate['Unknown Date'].push(photo)
      }
    })
    return photosGroupedByDate
  }
        


	getYear(e){  
			
			this.setState({
			inputYear:e.target.value
			//month_txt : e.target.value
                      });
		
	}
	getMonth(e){    

		this.setState({
			inputMonth: e.target.value
			//day_txt : e.target.value
                });
	}
	searchDay(e)
	{
		this.setState({
		year_txt:this.state.inputYear,
		month_txt:this.state.inputMonth
		
		});
		
	}


  groupedPhotosToImageGrids(groupedPhotos) {
    var imageGrids = []
    for (var date in groupedPhotos) {
      if (groupedPhotos.hasOwnProperty(date)) {
        var imageGrid = groupedPhotos[date].map(function(photo){
          return (
			<div style={{
                width:this.state.entrySquareSize,
                display:'inline-block'}}>
            <LazyLoad once offset={500} height={this.state.entrySquareSize} placeholder={<ImagePlaceholder size={this.props.entrySquareSize}/>}>
              <Image 
                style={{
                    marginLeft:0,
                    marginRight:0,
                    marginTop:0,
                    marginBottom:0,
                    paddingLeft:1,
                    paddingRight:1,
                    paddingTop:1,
                    paddingBottom:1}}
                height={this.state.entrySquareSize} 
                width={this.state.entrySquareSize} 
                src={serverAddress+'/media/square_thumbnails_tiny/'+photo.image_hash+'.jpg'}/>
            </LazyLoad>
            </div>

          )
        },this)
        var groupHeight = this.state.entrySquareSize*Math.ceil(groupedPhotos[date].length/this.state.numEntrySquaresPerRow.toFixed(1))
        var renderableImageGrid = (
          <div key={date} style={{paddingBottom:'20px'}}>

            <Header as='h2'>
              <Header.Content>
              {date}
              <Header.Subheader>
              {imageGrid.length} Photos
              </Header.Subheader>
              </Header.Content>
            </Header>
            
            <LazyLoad 
                height={groupHeight} 
                offset={500} 
                placeholder={
                    <div style={{
                        height:groupHeight, 
                        backgroundColor:'white'}}></div>
                }>
            <Image.Group>
              {imageGrid}
            </Image.Group>
            </LazyLoad>
          </div>
        )
        imageGrids.push(renderableImageGrid)
      }
    }
    return imageGrids
  }

  render() {
    var entrySquareSize = this.state.entrySquareSize
    var numEntrySquaresPerRow = this.state.numEntrySquaresPerRow
    //console.log('received all props?', this.receivedAllProps())
    if (this.props.fetchedPhotos){
      var groupedPhotos = this.groupPhotosByDate()
      var renderable = this.groupedPhotosToImageGrids(groupedPhotos)
    }
    else {
      var renderable = (
        <div>
          <Dimmer active>
            <Loader active>
              <Header color='grey'>Loading Photos</Header>
              {"If you just added a lot of photos, or haven't visited this page in a while, "} 
              {"this might take a long time, depending on the number of photos in your library. "}
              {"After the intial load, subsequent visits to this page should be faster from caching."}
            </Loader>
          </Dimmer>
        </div>
      )
    }
	const year_txt = this.state.year_txt;
	const month_txt = this.state.month_txt;
        const inputYear=this.state.inputYear;
	const inputMonth=this.state.inputMonth;
    return (
      <div>
		<input
			value={inputYear}
			onChange={this.getYear} />
		<input
			value={inputMonth}
			onChange={this.getMonth} />
		<button onClick={this.searchDay} >
		Search</button>
			
        {renderable}
      </div>
    )
  }
}




AllPhotosGroupedByDate = connect((store)=>{
  return {
    fetchedPhotos: store.photos.fetchedPhotos,
    fetchingPhotos: store.photos.fetchingPhotos,
    photos: store.photos.photos,    
    albumsDateList: store.albums.albumsDateList,
    fetchingAlbumsDateList: store.albums.fetchingAlbumsDateList,
    fetchedAlbumsDateList: store.albums.fetchedAlbumsDateList,
  }
})(AllPhotosGroupedByDate)
