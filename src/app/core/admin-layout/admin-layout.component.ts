import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy} from '@angular/core';
import {Note} from './../../shared/models/note-model';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  // Store Side-Nav-Bar content list(Notes)
  sideNavContent: Note[] = [ 
    {note_id: 1, user_id: 1, title: "TODO", note : "NOte1", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 2, user_id: 1, title: "TORead", note : "NOte2", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 3, user_id: 1, title: "Courses", note : "NOte3", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
  ];

  // Store Content of selected Note item
  noteContent: Note = 
    {note_id: 1, user_id: 1, title: "TODO", note : "Note contenttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt", created_on: "02/02/2020 07:12:00",modified_on: "02/02/2020 07:12:00"};

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
