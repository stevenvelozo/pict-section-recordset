const libPictProvider = require('pict-provider');

/** @type {Record<string, any>} */
const _DefaultProviderConfiguration = (
{
	"ProviderIdentifier": "Pict-DynamicForms-Solver",

	"AutoInitialize": true,
	"AutoInitializeOrdinal": 0,

	"AutoSolveWithApp": false
});

/**
 * The PictDynamicSolver class is a provider that solves configuration-generated dynamic views.
 */
class RecordSetDynamicSolver extends libPictProvider
{
	/**
	 * Creates an instance of the PictDynamicSolver class.
	 *
	 * @param {object} pFable - The fable object.
	 * @param {object} pOptions - The options object.
	 * @param {object} pServiceHash - The service hash object.
	 */
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(_DefaultProviderConfiguration)), pOptions);
		super(pFable, tmpOptions, pServiceHash);

		/** @type {import('pict') & {
		 *		instantiateServiceProviderIfNotExists: (hash: string) => any,
		 *		ExpressionParser: any,
		 *		PictSectionRecordSet: InstanceType<import('../Pict-Section-RecordSet.js')>
		 *	}} */
		this.pict;
		/** @type {import('pict') & { instantiateServiceProviderIfNotExists: (hash: string) => any, ExpressionParser: any }} */
		this.fable;
		/** @type {any} */
		this.log;
		/** @type {string} */
		this.UUID;
		/** @type {string} */
		this.Hash;

		// Initialize the solver service if it isn't up
		this.fable.instantiateServiceProviderIfNotExists('ExpressionParser');
	}

	/**
	 * Checks the solver and returns the solver object if it passes the checks.
	 *
	 * Automatically converts string solvers to have an Ordinal of 1.
	 *
	 * @param {string|object} pSolver - The solver to be checked. It can be either a string or an object.
	 * @param {boolean} [pFiltered=false] - Indicates whether the solvers should be filtered.
	 * @param {number} [pOrdinal] - The ordinal value to compare with the solver's ordinal value when filtered.
	 * @returns {object|undefined} - The solver object if it passes the checks, otherwise undefined.
	 */
	checkSolver(pSolver, pFiltered, pOrdinal)
	{
		let tmpSolver = pSolver;
		if (tmpSolver === undefined)
		{
			return;
		}
		if (typeof(tmpSolver) === 'string')
		{
			tmpSolver = {Expression:tmpSolver, Ordinal:1};
		}
		if (!('Expression' in tmpSolver))
		{
			this.log.error(`Dashboard solver ${pOrdinal} is missing the Expression property.`, { Solver: pSolver });
			return;
		}
		if (!(`Ordinal` in tmpSolver))
		{
			tmpSolver.Ordinal = 1;
		}

		// This filters the solvers
		if (pFiltered && (tmpSolver.Ordinal != pOrdinal))
		{
			return;
		}

		return tmpSolver;
	}

	/**
	 * Runs each RecordSet solver formulae for a dynamic view group at a given ordinal.
	 *
	 * Or for all ordinals if no ordinal is passed.
	 *
	 * @param {import('manyfest')} pManifest - The manifest for the RecordSet.
	 * @param {array} pCellSolverArray - An array of Solvers from the groups to solve.
	 * @param {number} pOrdinal - The ordinal value to filter to.  Optional.
	 * @param {Array<Record<string, any>>} pRecords - The records to solve against.
	 */
	executeCellSolvers(pManifest, pCellSolverArray, pOrdinal, pRecords)
	{
		// This is purely for readability of the code below ... uglify optimizes it out.
		let tmpFiltered = (typeof(pOrdinal) === 'undefined') ? false : true;

			// Solve the group RecordSet solvers first
		for (let j = 0; j < pCellSolverArray.length; j++)
		{
			let tmpSolver = this.checkSolver(pCellSolverArray[j].Solver, tmpFiltered, pOrdinal);
			if (typeof(tmpSolver) === 'undefined')
			{
				continue;
			}

			tmpSolver.StartTimeStamp = Date.now();
			tmpSolver.Hash = `CellSolver-${j}`;

			if (this.pict.LogNoisiness > 1)
			{
				this.log.trace(`Cell solving RecordSet ordinal ${tmpSolver.Ordinal} [${tmpSolver.Expression}]`);
			}

			const tmpRecords = Array.isArray(pRecords) ? pRecords : pRecords ? Object.values(pRecords) : [];
			for (let l = 0; l < tmpRecords.length; l++)
			{
				let tmpRecord = tmpRecords[l];
				tmpSolver.ResultsObject = {};
				const tmpSolverRecord = this.buildCellContextRecord(tmpRecord, pRecords, pManifest);
				let tmpSolutionValue = this.pict.ExpressionParser.solve(tmpSolver.Expression, tmpSolverRecord, tmpSolver.ResultsObject,
					pManifest, tmpRecord);
				if (this.pict.LogNoisiness > 1)
				{
					this.log.trace(`Cell solver [${tmpSolver.Expression}] record ${l} result was ${tmpSolutionValue}`);
				}
			}
			tmpSolver.EndTimeStamp = Date.now();
		}
	}

	/**
	 * @param {Record<string, any>} pRecord - The record to build the context for.
	 * @param {Array<Record<string, any>>} pRecords - The records to build the context from.
	 * @param {import('manyfest')} pManifest - The manifest for the RecordSet.
	 */
	buildCellContextRecord(pRecord, pRecords, pManifest)
	{
		return Object.assign({}, pRecord, this.buildGlobalContextRecord(pRecords, pManifest));
	}

	/**
	 * @param {Array<Record<string, any>>} pRecords - The records to build the context from.
	 * @param {import('manyfest')} pManifest - The manifest for the RecordSet.
	 */
	buildGlobalContextRecord(pRecords, pManifest)
	{
		return {
			Pict: this.pict,
			AppData: this.pict.AppData,
			RecordSubset: pRecords,
			Manifest: pManifest,
		};
	}

	/**
	 * Executes the section solvers at a given ordinal (or all if no ordinal is passed).
	 *
	 * @param {import('manyfest')} pManifest - The manifest for the RecordSet.
	 * @param {Array} pGlobalSolverArray - The array of view section solvers.
	 * @param {number} pOrdinal - The ordinal value.
	 * @param {Array<Record<string, any>>} pRecords - The records to solve against.
	 */
	executeDashboardSolvers(pManifest, pGlobalSolverArray, pOrdinal, pRecords)
	{
		let tmpFiltered = (typeof(pOrdinal) === 'undefined') ? false : true;

		for (let i = 0; i < pGlobalSolverArray.length; i++)
		{
			let tmpSolver = this.checkSolver(pGlobalSolverArray[i].Solver, tmpFiltered, pOrdinal);
			if (typeof(tmpSolver) === 'undefined')
			{
				continue;
			}

			tmpSolver.StartTimeStamp = Date.now();
			tmpSolver.Hash = `DashboardSolver-${i}`;

			// TODO: Precompile the solvers (it's super easy)
			if (this.pict.LogNoisiness > 1)
			{
				this.log.trace(`Dashboard solving equation ${i} ordinal ${tmpSolver.Ordinal}`);
			}
			tmpSolver.ResultsObject = {};
			const tmpRecord = this.buildGlobalContextRecord(pRecords, pManifest);
			let tmpSolutionValue = this.pict.ExpressionParser.solve(tmpSolver.Expression, tmpRecord, tmpSolver.ResultsObject, pManifest, tmpRecord);
			if (this.pict.LogNoisiness > 1)
			{
				this.log.trace(`[${tmpSolver.Expression}] result was ${tmpSolutionValue}`);
			}
			tmpSolver.EndTimeStamp = Date.now();
		}
	}

	/**
	 * Checks if the given ordinal exists in the provided ordinal set.
	 *
	 * If not, it adds the ordinal to the set.
	 *
	 * @param {number} pOrdinal - The ordinal to check.
	 * @param {Object} pOrdinalSet - The ordinal set to check against.
	 * @returns {Object} - The ordinal object from the ordinal set.
	 */
	checkAutoSolveOrdinal(pOrdinal, pOrdinalSet)
	{
		if (!(pOrdinal.toString() in pOrdinalSet))
		{
			pOrdinalSet[pOrdinal.toString()] = { DashboardSolvers:[], CellSolvers:[] };
		}
		return pOrdinalSet[pOrdinal];
	}

	/**
	 * Solves the views based on the provided view hashes or all views in pict.
	 *
	 * If non-dynamic views are also passed in, they are solved as well.
	 *
	 * This algorithm is particularly complex because it solves views in
	 * order across two dimensions:
	 *
	 * 1. The order of the views in the view hash array.
	 * 2. Precedence order (based on Ordinal)
	 *
	 * The way it manages the precedence order solving is by enumerating the
	 * view hash array multiple times until it exhausts the solution set.
	 *
	 * In dynamic views, when there are collisions in precedence order between
	 * Section Solvers and Group RecordSet Solvers, it prefers the RecordSet
	 * solvers first.  The thinking behind this is that a RecordSet solver is
	 * a "tier down" from the core Section it resides within.  These are
	 * leaves on the tree.
	 *
	 * @param {Record<string, any>} pManifestDefinition
	 * @param {Array<Record<string, any>>} pRecords - The records to solve against.
	 */
	solveDashboard(pManifestDefinition, pRecords)
	{
		let tmpSolveOutcome = {};
		tmpSolveOutcome.StartTimeStamp = Date.now();

		let tmpOrdinalsToSolve = {};
		tmpSolveOutcome.SolveOrdinals = tmpOrdinalsToSolve;
		const tmpCellDefinitions = Object.values(pManifestDefinition.Descriptors);
		for (const tmpCell of tmpCellDefinitions)
		{
			if (!Array.isArray(tmpCell?.PictDashboard?.Solvers))
			{
				continue;
			}
			for (const tmpRawSolver of tmpCell.PictDashboard.Solvers)
			{
				if (tmpRawSolver)
				{
					const tmpSolver = this.checkSolver(tmpRawSolver, false);
					const tmpOrdinalContainer = this.checkAutoSolveOrdinal(tmpSolver.Ordinal, tmpOrdinalsToSolve);
					tmpOrdinalContainer.CellSolvers.push({ CellHash: tmpCell.Hash, Solver:tmpSolver });
				}
			}
		}
		if (Array.isArray(pManifestDefinition.GlobalSolvers))
		{
			// Add the section solver(s)
			for (const tmpRawSolver of pManifestDefinition.GlobalSolvers)
			{
				if (tmpRawSolver)
				{
					const tmpSolver = this.checkSolver(tmpRawSolver, false);
					let tmpOrdinalContainer = this.checkAutoSolveOrdinal(tmpSolver.Ordinal, tmpOrdinalsToSolve);
					tmpOrdinalContainer.DashboardSolvers.push({ Solver: tmpSolver });
				}
			}
		}

		// Now sort the ordinal container keys
		let tmpOrdinalKeys = Object.keys(tmpOrdinalsToSolve);
		tmpOrdinalKeys.sort();
		const tmpManifest = this.pict.PictSectionRecordSet.getManifest(pManifestDefinition.Scope);
		// Now enumerate the keys and solve each layer of the solution set
		for (let i = 0; i < tmpOrdinalKeys.length; i++)
		{
			if (this.pict.LogNoisiness > 1)
			{
				this.log.trace(`DynamicSolver [${this.UUID}]::[${this.Hash}] Solving ordinal ${tmpOrdinalKeys[i]}`);
			}
			let tmpOrdinalContainer = tmpOrdinalsToSolve[tmpOrdinalKeys[i]];
			this.executeCellSolvers(tmpManifest, tmpOrdinalContainer.CellSolvers, Number(tmpOrdinalKeys[i]), pRecords);
			this.executeDashboardSolvers(tmpManifest, tmpOrdinalContainer.DashboardSolvers, Number(tmpOrdinalKeys[i]), pRecords);
		}

		tmpSolveOutcome.EndTimeStamp = Date.now();

		// It's up to the developer to decide if they want to use this information somewhere.
		this.lastSolveOutcome = tmpSolveOutcome;
	}
}

module.exports = RecordSetDynamicSolver;
module.exports.default_configuration = _DefaultProviderConfiguration;
