<?php

class VideoTooltipPublic {
  private $plugin_name;
  private $version;

  public function __construct( $plugin_name, $version ) {
    $this->plugin_name = $plugin_name;
    $this->version = $version;
        $this->register_shortcodes();
  }

  /**
   * @since           0.1.0
   */
  public function enqueue_styles() {
    // Component styles
    wp_enqueue_style( 'tooltipster', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/tooltipster.css', array(), $this->version, 'all' );
    wp_enqueue_style( 'tooltipster-light', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/themes/tooltipster-light.css', array( 'tooltipster' ), $this->version, 'all' );
    wp_enqueue_style( 'tooltipster-noir', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/themes/tooltipster-noir.css', array( 'tooltipster' ), $this->version, 'all' );
    wp_enqueue_style( 'tooltipster-punk', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/themes/tooltipster-punk.css', array( 'tooltipster' ), $this->version, 'all' );
    wp_enqueue_style( 'tooltipster-shadow', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/themes/tooltipster-shadow.css', array( 'tooltipster' ), $this->version, 'all' );
    // Plugin styles
    wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'bundle.css', array(), $this->version, 'all' );
  }

  /**
   * @since           0.1.0
   */
  public function enqueue_scripts() {
    // Component scripts
    wp_enqueue_script( 'froogaloop2', '//f.vimeocdn.com/js/froogaloop2.min.js', array(), $this->version, false );
    wp_enqueue_script( 'tooltipster', plugin_dir_url( __FILE__ ) . 'components/tooltipster/js/jquery.tooltipster.min.js', array( 'jquery' ), $this->version, false );
    wp_enqueue_script( 'youtube', '//www.youtube.com/iframe_api', array(), $this->version, false );
    // Plugin scripts
    wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'bundle.js', array( 'jquery', 'tooltipster' ), $this->version, false );
  }

  /**
   * @since           0.1.0
   */
  public function register_shortcodes() {
      add_shortcode( 'video-tooltip', array( $this, 'shortcode_video_tooltip' ) );
  }

  /**
   * @since           0.1.0
   */
  public function shortcode_video_tooltip( $atts, $content, $tag ) {
      $a = shortcode_atts( array(
          'animation' => 'swing',
          'autohide'  => '1',
          'autoplay'  => '1',
          'class'     => '',
          'color'     => '',
          'controls'  => '0',
          'begin'     => '0',
          'end'       => '',
          'id'        => '',
          'loop'      => '0',
          'mute'      => '0',
          'provider'  => 'youtube',
          'theme'     => 'tooltipster-light',
          'video_id'  => '',
      ), $atts );

      $animation      = $a['animation'];
      $class          = $a['class'];
      $controls       = $a['controls'];
      $begin          = $a['begin'];
      $end            = $a['end'];
      $id             = $a['id'];
      $mute           = $a['mute'];
      $provider       = $a['provider'];
      $size           = $a['size'];
      $theme          = $a['theme'];
      $video_id       = $a['video_id'];

      return <<< EOT
          <div id="$id" class="video-tooltip-shortcode $class"
            data-provider="$provider"
            data-video-id="$video_id"
            data-option-animation="$animation"
            data-option-autohide="$autohide"
            data-option-autoplay="$autoplay"
            data-option-begin="$begin"
            data-option-color="$color"
            data-option-controls="$controls"
            data-option-end="$end"
            data-option-loop="$loop"
            data-option-mute="$mute"
            data-option-theme="$theme">
            $content
          </div>
EOT;
    }
}
