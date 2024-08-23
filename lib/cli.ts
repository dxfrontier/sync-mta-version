#!/usr/bin/env node

import { VersionUpdater } from './core/VersionUpdater';

new VersionUpdater().syncVersion();
