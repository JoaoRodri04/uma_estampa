import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncomendaPage } from './encomenda.page';

describe('EncomendaPage', () => {
  let component: EncomendaPage;
  let fixture: ComponentFixture<EncomendaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
