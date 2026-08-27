import { TestBed } from '@angular/core/testing';

import { FamilyMember } from './family-member';

describe('FamilyMember', () => {
  let service: FamilyMember;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyMember);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
