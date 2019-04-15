{
    let view = {
        el: '.songSheetList',
        init(){
            this.$el = $(this.el)
        },
        render(data={}){
            console.log(data)
            data.map((value)=>{
                console.log(value)
                this.$el.append(`
                    <li class="songSheet" playlist-id="${value.id}">
                        <a href="./playlist.html?id=${value.id}">
                            <div class="img">
                                <img src="${value.img}">
                                <p>${value.summary}</p>
                            </div>
                        </a>
                    </li>
                `)
            })
        }
    }

    let model = {
        data: {
            playlists: []
        },
        find(){
            var query = new AV.Query('playlist');
            console.log(2)
            console.log(query)
            // top 6
            return query.find().then((playlist)=>{
                console.log(playlist)
                this.data.playlists = playlist.map((playlist)=>{
                    this.data.playlists.push({id:playlist.id,...playlist.attributes})
                    console.log(this.data)
                    return {id:playlist.id,...playlist.attributes}
                })
            })
        }
    }

    let controller = {
        init(view,model){
            console.log(1)
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(()=>{
                console.log(this.model.data)
                this.view.render(this.model.data.playlists)
            })

        },

    }
    controller.init(view,model)
}
