import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy} from '@angular/core';
import {Note} from './../../shared/models/note-model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  // Store Side-Nav-Bar content list(Notes)
  notes: Note[] = [ 
    {note_id: 1, user_id: 1, title: "TODO", note : "NOte1", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 2, user_id: 1, title: "TORead", note : "Note....2", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 3, user_id: 1, title: "Courses", note : "Note....3", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 4, user_id: 1, title: "TODO 4", note : "Note....4", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 5, user_id: 1, title: "TORead 5", note : "NOte....5", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 6, user_id: 1, title: "Courses 6", note : "Note....6", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 7, user_id: 1, title: "TODO 7", note : "Note......7", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 8, user_id: 1, title: "TORead 8", note : "NOte.....8", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
    {note_id: 9, user_id: 1, title: "Courses 9", note : "NOte.....9", created_on: "02/02/2020 07:12:00", modified_on: "02/02/2020 07:12:00"},
  ];

  // Store Content of selected Note item
  noteContent: Note = 
    {note_id: 1, user_id: 1, title: "TODO", note : "Default active note...", created_on: "02/02/2020 07:12:00",modified_on: "02/02/2020 07:12:00"};

  noteTitleFC = new FormControl();
  noteFC = new FormControl();
  currentTS: string;
  activeNoteIndex: number = 0;
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

  /**
   * Purpose: Set selected Note as active Note
   * @param selectedNote: Note
   * @param index: number 
   * @returns void
   */
  viewSelectedNote(selectedNote: Note, index: number): void {
    console.log( "Note Index: "+ String(index) +"; Selected Note: " , selectedNote);
    this.noteContent = selectedNote;
    this.noteTitleFC.setValue(this.noteContent.title);
    this.noteFC.setValue(this.noteContent.note); 
    this.activeNoteIndex = index;
  }

  /**
   * Purpose: Updates active Note, if modified
   * @returns void
   */
  onNoteChange(): void {
    console.log("Note Title: "+this.noteTitleFC.value+ "; Note: "+ this.noteFC.value);
    this.updateTimestamp();
    // update the notes list
    var updatedNote: Note = {
      note_id: this.noteContent.note_id, 
      user_id: this.noteContent.user_id ,
      title: this.noteTitleFC.value, 
      note : this.noteFC.value, 
      created_on: this.noteContent.created_on,
      modified_on: this.currentTS,
    };
    // update the notes array
    this.notes[this.activeNoteIndex] = updatedNote;

  }

  /**
   * Purpose: Updates the currentTS variable with current timestamp
   */
  updateTimestamp(): void {
   this.currentTS = String(new Date()).replace(" GMT+0530 (India Standard Time)", "");
   ("Time Now: "+this.currentTS);
  }

  /**
   * Purpose: Set the Content
   */
  setNote(): void {
    // update
    this.noteTitleFC.setValue(this.noteContent.title);
    this.noteFC.setValue(this.noteContent.note);
    this.noteContent.modified_on = this.currentTS;
    console.log("Note set as: ", this.noteContent);
  }



}
