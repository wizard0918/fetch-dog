export interface FormState {
  name: string;
  email: string;
}

export interface ErrorState {
  nameError: boolean;
  emailError: boolean;
}

export interface DogData {
  id: string;
  age: number;
  breed: string;
  img: string;
  name: string;
  zip_code: string;
}


export interface SearchResult {
  resultIds: string[]; 
  total: number;       
  next?: string;       
  prev?: string;    
}

export interface SearchTerms {
  breeds: string;
  zipCodes: string;
  ageMin: number;
  ageMax: number;
  size: string;
  sort: string;
}