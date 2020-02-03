import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy} from '@angular/core';
import {Note} from './../../shared/models/note-model';
import { FormControl } from '@angular/forms';
import {NotesService} from './../../shared/services/notes.service';
import * as uuid from 'uuid';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  // Store Side-Nav-Bar content list(Notes)
  notes: Note[] = []

  // Store Content of selected Note item
  noteContent: Note = {note_id: "", user_id: 1, title: "", note : "", created_on: "",modified_on: ""};

  noteTitleFC = new FormControl();
  noteFC = new FormControl();
  searchFC = new FormControl();
  currentTS: string;
  activeNoteIndex: number = 0;
  isActiveNote: boolean = false;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private _notesService: NotesService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    // this._notesService.updateLocalNotes(this.notes);
    this.notes = this._notesService.getNotes("");
  }

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
    this.isActiveNote = true;
  }

  /**
   * Purpose: Updates active Note, if modified
   * @returns void
   */
  onNoteChange(): void {
    console.log("Note Title: "+this.noteTitleFC.value+ "; Note: "+ this.noteFC.value);
    this.updateTimestamp();
    var response = "";
    // For New Note
    if(this.noteContent.note_id === "") {
      var newNote: Note ={
        note_id : uuid.v4(),
        user_id : 1, 
        title : String(this.noteTitleFC.value),
        note : String(this.noteFC.value),
        created_on: this.currentTS,
        modified_on: this.currentTS,
      }
      console.log("Add New Note: ", newNote);
      response = this._notesService.addNote(newNote);
      // update the active note
      this.noteContent = newNote;

    } else {
      // update the notes list
      var updatedNote: Note = {
        note_id: this.noteContent.note_id, 
        user_id: this.noteContent.user_id,
        title: this.noteTitleFC.value, 
        note : this.noteFC.value, 
        created_on: this.noteContent.created_on,
        modified_on: this.currentTS,
      };
      console.log("Updated Note: ", updatedNote);
      response = this._notesService.updateNote(updatedNote);
      // update the active note
      this.noteContent = updatedNote;

    }
    // update the notes array
    // this.notes[this.activeNoteIndex] = updatedNote;
    // update notes list
    this.getNotes();
    console.log(response);

  }

  /**
   * Purpose: Updates the currentTS variable with current timestamp
   */
  updateTimestamp(): void {
   this.currentTS = String(new Date()).replace(" GMT+0530 (India Standard Time)", "");
   ("Time Now: "+this.currentTS);
  }

  /**
   * Purpose: Set the note editor to default to add new note
   * 
   */
  addNote(): void {
    console.log("Add note clicked!");
    this.setDefaultNote();
  }

  /**
   * Purpose: Delete active Note
   * @returns void
   */
  deleteSelectedNote(): void {
    console.log("Delete note_id: "+ this.noteContent.note_id);
    if(this.isActiveNote)
      var response = this._notesService.deleteNote(this.noteContent.note_id);
      console.log(response)
    // Set Default Note
    this.setDefaultNote();
  }

  /**
   * Purpose: Get Notes List & performs deep search throughout the Notes, stores the foundset to sidenave notes list
   * @returns void
   */
  getNotes(): void {
    //this.toggelActiveNote();
    console.log("Search Note...: "+ this.searchFC.value);
    this.notes = this._notesService.getNotes(this.searchFC.value);
    // Set the Note as default if search performed
    if(this.searchFC.value)
      this.setDefaultNote();
  }

  /**
   * Purpose: Toggles the Active Note State, while searching/deleting etc.
   * @returns void
   */
  toggelActiveNote(): void {
    this.isActiveNote!=this.isActiveNote;
    // If none of the Note is active
    if(!this.isActiveNote)
      this.setDefaultNote();
  }

  /**
   * Purpose: To set the empty default Note
   * @returns void
   */
  setDefaultNote(): void {
    this.updateTimestamp();
    console.log("inside setDefault Note");
    this.noteContent.note_id="";
    this.noteContent.user_id=1;
    this.noteFC.setValue("");
    this.noteTitleFC.setValue("");
    this.noteContent.created_on = this.currentTS;
    this.noteContent.modified_on = "";
  }

}
