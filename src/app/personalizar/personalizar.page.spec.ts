import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalizarPage } from './personalizar.page';

describe('PersonalizarPage', () => {
  let component: PersonalizarPage;
  let fixture: ComponentFixture<PersonalizarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
