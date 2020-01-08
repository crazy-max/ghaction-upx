export = decompresstarxz;

declare function decompresstarxz(
  input: string | Buffer,
  output?: string | decompresstarxz.DecompressOptions,
  opts?: decompresstarxz.DecompressOptions
): Promise<decompresstarxz.File[]>;

declare namespace decompresstarxz {
  interface File {
    data: Buffer;
    mode: number;
    mtime: string;
    path: string;
    type: string;
  }

  interface DecompressOptions {
    /**
     * Filter out files before extracting
     */
    filter?(file: File): boolean;
    /**
     * Map files before extracting
     */
    map?(file: File): File;
    /**
     * Array of plugins to use.
     * Default: [decompressTar(), decompressTarbz2(), decompressTargz(), decompressUnzip()]
     */
    plugins?: any[];
    /**
     * Remove leading directory components from extracted files.
     * Default: 0
     */
    strip?: number;
  }
}
