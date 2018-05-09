import 'zone.js';
import 'reflect-metadata';
import { Component, OnInit } from '@angular/core';
import { ViserModule } from 'viser-ng';

const data = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 3.5 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9 },
  { year: '1996', value: 6 },
  { year: '1997', value: 7 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 },
];
const scale = [{
  dataKey: 'value',
  min: 0,
},{
  dataKey: 'year',
  min: 0,
  max: 1,
}];

@Component({
  selector: 'app-cw-search',
  templateUrl: './cw-search.component.html',
  styleUrls: ['./cw-search.component.css']
})
export class CwSearchComponent implements OnInit {

  forceFit: boolean= true;
  height: number = 400;
  data = data;
  scale = scale
  constructor() { }


  

  ngAfterViewInit(){
 
  }


  ngOnInit() {
  }

}

