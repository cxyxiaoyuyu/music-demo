{
    let view = {
        el: '#app',
        init(){
            this.$el = $(this.el)
        },
        template: `

        `,
        render(data){
            this.$el.find('audio').attr('src','./audio/laojie.mp3')
            this.$el.find('.songImg').attr('src',`./img/xiaochou.jpg`)
            this.$el.find('.cover').css('background-image',`url('./img/xiaochou.jpg')`)
            this.$el.find('.songName').text(`李荣浩-老街.mp3`)
            let lyrics = data.lyrics.split('\n')
            console.log(lyrics)
            lyrics.map((value)=>{
                let reg = /\[([\d:.]+)\](.+)/
                let matches =  value.match(reg)
                let time = parseInt(matches[1].split(':')[0]) * 60 + parseFloat(matches[1].split(':')[1])
                this.$el.find('.lyrics>.lines').append(`
                    <p data-time="${time}">${matches[2]}</p>
                `)
            })
        },
        play(){
            this.$el.find('audio')[0].play()
        },
        pause(){
            this.$el.find('audio')[0].pause()
        },
        showLyrics(time){
            let p
            $.each(this.$el.find('.lyrics>.lines>p'),(index,value)=>{
                if($(value).next().length){
                    let currentTime = $(value).attr('data-time')
                    let nextTime = $(value).next().attr('data-time')
                    if(time>=currentTime && time <=nextTime){
                        p = value
                        return false
                    }
                }else{
                    p = value
                }
            })
            $(p).addClass('active').siblings().removeClass('active')
            let pHeight = p.getBoundingClientRect().top
            let linesHeight = this.$el.find('.lyrics>.lines')[0].getBoundingClientRect().top
            let height = pHeight - linesHeight - 24
            this.$el.find('.lines').css({
                transform: `translateY(-${height}px)`
            })
        },
    }
    let model = {
        data: {id:'',url:'',name:'',singer:''},
        get(id){
            let query = new AV.Query('song');
            return query.get('5c8e10bafe88c200658a6c91').then((song)=>{
                this.data = {id,...song.attributes}
            })
        }
    }

    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.getSongId()
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','.disc-container',(ev)=>{
                if($(ev.currentTarget).hasClass('playing')){
                    this.view.$el.find('#play').removeClass('hide')
                    this.view.pause()
                }else{
                    this.view.$el.find('#play').addClass('hide')
                    this.view.play()
                }
                $(ev.currentTarget).toggleClass('playing')
            })
            let audio = this.view.$el.find('audio')[0]
            audio.onended = ()=>{
                this.view.pause()
                console.log('end')
                this.view.$el.find('.disc-container').removeClass('playing')
            }
            audio.ontimeupdate = ()=>{
                this.view.showLyrics(audio.currentTime)
            }
        },
        getSongId(){
            let search = window.location.search.substring(1)
            let query = search.split('&').filter(v=>v)
            let id = query[0].split('=')[1]
            this.model.get(id).then(()=>{
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}

