{
    let view = {
        el: '#songList',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            console.log(data)
            let {songs} = data
            songs.map((song)=>{
                this.$el.append(`
                    <li class="song">
                        <h3>${song.name}</h3>
                        <p>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-sq"></use>
                            </svg>
                            <span class="singer">${song.singer}</span>
                        </p>
                        <a class="playButton" href="./play-song.html?id=${song.id}">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-play"></use>
                        </svg>
                        </a>
                    </li>
               `)
            })
        }
    }

    let model = {
        data: {
            songs: []
        },
        find(){
            var query = new AV.Query('song');
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    this.data.songs.push({id:song.id,...song.attributes})
                    return {id:song.id,...song.attributes}
                })
            })
        }
    }


    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}
