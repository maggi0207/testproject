const scmClearQuerPParam =
      window.location && window.location.search && window.location.search.indexOf('scr=Y') !== -1;
    if (!window?.mfe?.scmPlanMfeEnable || (window?.mfe?.scmPlanMfeEnable && scmClearQuerPParam)) {
      getPlansdata({
        body: { cartId: '', enableAssistedTagging: true, selectedMtn: sessionStorage.getItem('activeMTN') },
      });
    }
