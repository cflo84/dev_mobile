import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RenameListComponent } from './rename-list.component';

describe('RenameListComponent', () => {
  let component: RenameListComponent;
  let fixture: ComponentFixture<RenameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RenameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
