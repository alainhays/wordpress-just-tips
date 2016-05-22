<?php

class VideoTooltip {
  protected $loader;
  protected $plugin_name;
  protected $version;

  public function __construct() {

    $this->plugin_name = 'video-tooltip';
    $this->version = '{VERSION}';

    $this->load_dependencies();
    $this->define_public_hooks();
  }

  private function load_dependencies() {

    require_once plugin_dir_path( __FILE__ ) . 'video-tooltip-loader.php';
    require_once plugin_dir_path( __FILE__ ) . 'video-tooltip-public.php';

    $this->loader = new VideoTooltipLoader();
  }

  private function define_public_hooks() {
    $plugin_public = new VideoTooltipPublic( $this->get_plugin_name(), $this->get_version() );
    $this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
    $this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
  }

  /**
   * @since           0.1.0
   */
  public function run() {
    $this->loader->run();
  }

  /**
   * @since           0.1.0
   */
  public function get_plugin_name() {
    return $this->plugin_name;
  }

  /**
   * @since           0.1.0
   */
  public function get_loader() {
    return $this->loader;
  }

  /**
   * @since           0.1.0
   */
  public function get_version() {
    return $this->version;
  }
}