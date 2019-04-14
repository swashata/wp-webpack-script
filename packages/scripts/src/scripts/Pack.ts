import archiver from 'archiver';
import cpy from 'cpy';
import del from 'del';
import fs from 'fs';
import makeDir from 'make-dir';
import path from 'path';
import { ProjectConfig } from '../config/project.config.default';

export interface Callbacks {
	onMkDirPackage(path: string): void;
	onClean(paths: string[]): void;
	onMkDirSlug(path: string): void;
	onCopy(): void;
	onBeforeCopy(): void;
	onCopyProgress(progress: cpy.ProgressData): void;
	onBeforeZip(): void;
	onZipProgress(progress: archiver.ProgressData): void;
	onZip(result: ArchiveResolve): void;
}

export interface ArchiveResolve {
	size: number;
	path: string;
	relPath: string;
}

export class Pack {
	private projectConfig: ProjectConfig;

	private packageSlugPath: string;

	private packageDirPath: string;

	private packageZipPath: string;

	private cwd: string;

	private callbacks: Callbacks;

	constructor(
		projectConfig: ProjectConfig,
		callbacks: Callbacks,
		cwd: string
	) {
		this.projectConfig = projectConfig;
		this.cwd = cwd;
		this.callbacks = callbacks;
		this.packageDirPath = path.resolve(
			this.cwd,
			projectConfig.packageDirPath
		);
		this.packageSlugPath = path.resolve(
			this.cwd,
			this.packageDirPath,
			projectConfig.slug
		);
		this.packageZipPath = path.resolve(
			this.cwd,
			this.packageDirPath,
			`${this.projectConfig.slug}.zip`
		);
	}

	public async pack(): Promise<void> {
		// First make the directory if needed
		const packagePath = await this.mkDirPackage();
		this.callbacks.onMkDirPackage(packagePath);
		// Clean up
		const cleanUps = await this.clean();
		this.callbacks.onClean(cleanUps);
		// Create copy to (slug) directory
		const slugPath = await this.mkDirPackageSlug();
		this.callbacks.onMkDirSlug(slugPath);
		// Copy files
		this.callbacks.onBeforeCopy();
		await this.copy();
		this.callbacks.onCopy();
		// Zip
		this.callbacks.onBeforeZip();
		const result = await this.zip();
		this.callbacks.onZip(result);
	}

	private async mkDirPackage(): Promise<string> {
		return makeDir(this.packageDirPath);
	}

	private async clean(): Promise<string[]> {
		return del(`${this.packageDirPath}/**`);
	}

	private async mkDirPackageSlug(): Promise<string> {
		return makeDir(this.packageSlugPath);
	}

	private async copy(): Promise<void> {
		return cpy(this.projectConfig.packageFiles, this.packageSlugPath, {
			parents: true,
			cwd: this.cwd,
		}).on('progress', this.callbacks.onCopyProgress);
	}

	private async zip(): Promise<ArchiveResolve> {
		return new Promise<ArchiveResolve>((resolve, reject) => {
			// Create the stream
			const output = fs.createWriteStream(this.packageZipPath);
			// Create archiver object
			const archive = archiver('zip', {
				zlib: { level: this.projectConfig.zlibLevel },
			});

			// Resolve when output is closed
			output.on('close', () => {
				resolve({
					size: archive.pointer(),
					path: `${this.packageZipPath}`,
					relPath: path.relative(this.cwd, this.packageZipPath),
				});
			});

			// Reject on blocking errors and warnings
			archive.on('error', err => {
				reject(err);
			});

			// On Progress
			archive.on('progress', this.callbacks.onZipProgress);

			// Pipe archive to the file
			archive.pipe(output);

			// Append the directory
			archive.directory(
				`${this.packageSlugPath}/`,
				this.projectConfig.slug
			);

			// finalize
			archive.finalize();
		});
	}
}
