/// <reference path="../../typings/index.d.ts" />

(function ($: JQueryStatic) {

  $(document).ready(() => {
    $('.video-tooltip-container').each((index) => {
      var preview = $(this);

      preview.tooltipster({
        position: 'top',
        contentAsHTML: true,
        content: '<div class="video-tooltip-video-wrapper"><div id="video-tooltip-player-' + index + '"></div></div>',
        functionReady: () => {
          console.log(preview, preview.data('provider'));
          switch (preview.data('provider')) {
            case 'youtube': {
              var player = new YT.Player('video-tooltip-player-' + index, {
                videoId: preview.data('video-id'),
                playerVars: {
                  'autoplay': 1,
                  'controls': 0,
                  'start': 0
                },
                events: {
                  'onReady': function (event) {
                    if (preview.data('option-mute') == '1') {
                      player.mute();
                    }
                    event.target.playVideo();
                  }
                }
              });
            }

            default:
              console.error('No valid provider found.');
          }
        }
      });
    });
  });

} ((window as any)['jQuery']));
