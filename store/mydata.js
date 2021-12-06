export const state = () => ({
    list: [],
    site:"internal",
    gobal_api:process.env.internal
  })
  
  export const mutations = {
    add(state, text) {
      state.list.push({
        text,
        done: false
      })
    },
    remove(state, { mydata }) {
      state.list.splice(state.list.indexOf(mydata), 1)
    },
    toggle(state, mydata) {
        mydata.done = !mydata.done
    },
    set_site(state,text){
        state.site = text;
    },
    set_api(state,text){
        state.gobal_api = text;
    }
  }