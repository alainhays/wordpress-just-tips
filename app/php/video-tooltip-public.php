<?php

class VideoTooltipPublic {
  /**
   * The ID of this plugin.
   *
   * @since    1.0.0
   * @access   private
   * @var      string    $plugin_name    The ID of this plugin.
   */
  private $plugin_name;

  /**
   * The version of this plugin.
   *
   * @since    1.0.0
   * @access   private
   * @var      string    $version    The current version of this plugin.
   */
  private $version;

  /**
   * Initialize the class and set its properties.
   *
   * @since    1.0.0
   * @param      string    $plugin_name       The name of the plugin.
   * @param      string    $version    The version of this plugin.
   */
  public function __construct( $plugin_name, $version ) {
    $this->plugin_name = $plugin_name;
    $this->version = $version;
        $this->register_shortcodes();
  }

  /**
   * Register the stylesheets for the public-facing side of the site.
   *
   * @since    1.0.0
   */
  public function enqueue_styles() {
    wp_enqueue_style( 'tooltipster', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/tooltipster.css', array(), $this->version, 'all' );
    wp_enqueue_style( 'tooltipster', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/themes/tooltipster-light.css', array(), $this->version, 'all' );
    wp_enqueue_style( 'tooltipster', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/themes/tooltipster-noir.css', array(), $this->version, 'all' );
    wp_enqueue_style( 'tooltipster', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/themes/tooltipster-punk.css', array(), $this->version, 'all' );
    wp_enqueue_style( 'tooltipster', plugin_dir_url( __FILE__ ) . 'components/tooltipster/css/themes/tooltipster-shadow.css', array(), $this->version, 'all' );
    wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'bundle.css', array(), $this->version, 'all' );
  }

  /**
   * Register the stylesheets for the public-facing side of the site.
   *
   * @since    1.0.0
   */
  public function enqueue_scripts() {
    /**
     * This function is provided for demonstration purposes only.
     *
     * An instance of this class should be passed to the run() function
     * defined in Hover_Video_Preview_Loader as all of the hooks are defined
     * in that particular class.
     *
     * The Hover_Video_Preview_Loader will then create the relationship
     * between the defined hooks and the functions defined in this
     * class.
     */
    wp_enqueue_script( 'youtube', '//www.youtube.com/iframe_api', array(), $this->version, false );
    wp_enqueue_script( 'froogaloop2', '//f.vimeocdn.com/js/froogaloop2.min.js', array(), $this->version, false );
    wp_enqueue_script( 'tooltipster', plugin_dir_url( __FILE__ ) . 'components/tooltipster/js/jquery.tooltipster.min.js', array( 'jquery', 'youtube', 'froogaloop2' ), $this->version, false );
    wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'bundle.js', array( 'tooltipster' ), $this->version, false );
  }

    /**
     * Registers the shortcodes
     */
    public function register_shortcodes() {
        add_shortcode( 'video-tooltip', array( $this, 'shortcode_video_tooltip' ) );
    }

    /**
     * Builds the shortcode output.
     *
     * @param $atts
     * @param $content
     * @param $tag
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
