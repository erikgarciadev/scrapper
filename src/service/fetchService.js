class FetchService {
    urlApi = 'http://localhost:3000/profiles';

    async createProfile(profile) {
        return fetch(this.urlApi ,{
          method : 'POST',
          body   : JSON.stringify({ ...profile }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          }
        } );
      }
  }
  
  export default new FetchService();