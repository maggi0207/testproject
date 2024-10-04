import React, { useState, useEffect, useRef } from "react";
import { MapTo } from "@adobe/aem-react-editable-components";
import ReactPaginate from "react-paginate";
import { learningAndResourcesEvent, dataLayerLearningArticleEvent, dataLayerLearningFiltersEvent, dataLayerLearningFiltersCapturingEvent } from '../../../utils/analyticsUtils';
import {ReactComponent as DropdownArrow} from '../../../design/icons/optum-icons/dropdown_arrow.svg';
import {ReactComponent as FilterCross} from '../../../design/icons/optum-icons/filter_cross.svg';
import {ReactComponent as DropdownCheckmark} from '../../../design/icons/optum-icons/dropdown_checkmark.svg';
import * as constants from "../../../../src/utils/constants";

export const ArticleListConfig = {
    emptyLabel: "Article List",

    isEmpty: function (props) {
        return !props || !props.cqItemsOrder || props.cqItemsOrder.length === 0;
    },
};

const ArticlesList = ({ filterListItems, btnTitle }) => {
    
    return (
        <div className="articleList__content">
            <ul className="articleList__items">
                {filterListItems &&
                    filterListItems.map((item, index) => (
                        <li key={index} className="articleList__item">
                                <h4 className="articleList__subTitle">
                                    {item?.relatedContentBean?.title}
                                </h4>
                                <p>
                                    {item?.relatedContentBean?.description}
                                </p>
                                <a className="btn-secondary"   onClick={() => {
                                    if (item?.relatedContentBean?.title && item?.relatedContentBean?.pagePath) {
                                        dataLayerLearningArticleEvent("Article List: Card Article is available", item?.relatedContentBean?.pagePath, item?.relatedContentBean?.title);
                                    } else {
                                        dataLayerLearningArticleEvent("Article List: Card Article is not available");
                                    }
                                }} href={item?.relatedContentBean?.pagePath}>{btnTitle}</a>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

const ArticleList = (props) => {
	const queryParams = new URLSearchParams(window.location.search);
    // Fetches page number, count per page from URL.
	let initialPageNum = queryParams.get("pageNum") !== null ? parseInt(queryParams.get("pageNum")) : 0;
    let countPerPageValue = 12;
	let initialCountPerPage = queryParams.get("countPerPage") !== null ? parseInt(queryParams.get("countPerPage")) : countPerPageValue;
	let initialCategory = [];


    const [selectedCountPerPage, setSelectedCountPerPage] = useState(initialCountPerPage);
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [activePage, setActivePage] = useState(initialPageNum);
    const [itemOffset, setItemOffset] = useState(0);
    const [backClick, setBackClick] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [artlicleListItems, setArticleListItems] = useState(props?.articlesList);
    const [filterListItems, setFilterListItems] = useState(props?.articlesList);
    const [faqState, setFaqState] = useState(false);
    const [currentSelectedCategory, setCurrentSelectedCategory] = useState({value: '', checked: ''});

    const articleViewStart = useRef(null); 

    const initialDispVal = (activePage+1)*countPerPageValue;
    const [displayValue, setDisplayValue] = useState(initialDispVal);
    const [showArticleList, setShowArticleList] = useState(null);
    const [isChecked,setIsChecked] =useState(false);
    const [selectedFilteredData, setSelectedFilteredData] = useState([]);
    const [applyShow, setApplyShow] = useState(false);

    const clearAllRef = useRef(null);
    const applyCatRef = useRef(null);

    useEffect(()=>{
        setDisplayValue(filterListItems.length >= initialDispVal ? initialDispVal : filterListItems.length)
    },[initialDispVal]);
    

    const [accordionData] = useState(
        props?.faqList?.[0]?.responsiveGrid?.[":items"]?.accordion?.[":items"]
            ? props?.faqList?.[0]?.responsiveGrid?.[":items"]?.accordion?.[":items"]
            : {}
    );
    let faqData = [];
    // Pushes all accordion data to faqData var.
    Object.entries(accordionData).forEach(([key, value]) => {
        faqData.push(value);
    });

    // Cheks if any FAQAccordionList element has expanded set to true.
    const faqInitialExpandedItems = props?.faqList?.[0]?.responsiveGrid?.[":items"]?.accordion?.expandedItems
        ? props?.faqList?.[0]?.responsiveGrid?.[":items"]?.accordion?.expandedItems
        : []

    // Checks the FAQAccordionList elements item order.
    const faqItemOrder = props?.faqList?.[0]?.responsiveGrid?.[":items"]?.accordion?.[":itemsOrder"]
        ? props?.faqList?.[0]?.responsiveGrid?.[":items"]?.accordion?.[":itemsOrder"]
        : [];

    let initialKeys = [];

    faqItemOrder.map((item, i) => {
        if (faqInitialExpandedItems.includes(item)) {
          initialKeys.push(i);
        }
      }
    );

    // Sets the setActiveAccordian with expanded FAQAccordionList elements which will get expanded on page load.
    const [activeAccordian, setActiveAccordian] = useState(initialKeys);

    // If single expansion is set to true then only one FAQAccordionList accordion will be expanded at a given time.
    const faqSingleExpansion =
        props?.faqList?.[0]?.responsiveGrid?.[":items"]?.accordion?.singleExpansion
        ? props?.faqList?.[0]?.responsiveGrid?.[":items"]?.accordion?.singleExpansion
        : false
    ;
    const tagTitle = props?.tagsTitleMap;
    let tagValues = [];

    // Maps tag values with the tag title authored.
    if (tagTitle != null) {
        Object.entries(tagTitle).forEach(([key, value]) => {

            const keyMatch = key;
            const valueAdd = value;

            Object.entries(props?.articleCounterMap).forEach(([key, value]) => {

                if (key == keyMatch) {
                    tagValues.push({ [valueAdd]: value });
                }

            });
        })
    };


    let tagTitleKey = props?.faqList?.[0]?.pageTags?.[0];
    let faqname = props?.faqList?.[0]?.tagsTitleMap?.[tagTitleKey];

    useEffect(() => {
        setArticleListItems(props?.articlesList);
        setFilterListItems(props?.articlesList);
        // setCurrentItems(props?.articlesList);
    }, []);

    // Items per page number array to display the number of items per page.
    const itemsPerPageCountArray = [4, 8, 12];

    /**
     * Rests the pagination on every user interaction and re calculate the pagination pages, page length
     *  depending on the number of list items.
     * @param {Number} calculateSelectedCountPerPage - Items to be displayed per page.
     * @param {Array} calculateArticleListItems - Total items to the paginated.
     * @param {Number} calculateItemOffset - Offset value required by Pagination component to calculate total pages.
     */
    const setPagination = (
        calculateSelectedCountPerPage,
        calculateArticleListItems,
        calculateItemOffset
    ) => {
        const endOffset = calculateItemOffset + calculateSelectedCountPerPage;
        // If items to be displayed per paage is more than total articles list length.
        if (calculateSelectedCountPerPage > calculateArticleListItems?.length) {
            // Update setCurrentItems state value directly to total article items..
            setCurrentItems(calculateArticleListItems);
        } /* Else slice the total article items offset and end offset. */ else {
            setCurrentItems(
                calculateArticleListItems?.slice(calculateItemOffset, endOffset)
            );
        }
        // Sets number of pages required state setPageCount to total elements divide by items to be displayed per page.
        setPageCount(
            Math.ceil(
                calculateArticleListItems?.length / calculateSelectedCountPerPage
            )
        );
    };

    // Fires when the active history entry changes while the user navigates the session history.
	window.onpopstate = () => {
        // Fetches search params.
		const params = new URL(document.location.href).searchParams;
		if (Array.from(params).length > 0) {
			setBackClick(true);
			const pageNum = params.get('pageNum');
			const countPerPage = params.get('countPerPage');
			let initialCategory = [];
            // Sets active page number to the page number fetched from URL.
			setActivePage(parseInt(pageNum));
            // Sets active count per page to the count per page fetched from URL.
			setSelectedCountPerPage(parseInt(countPerPage));
            // Sets active selected category to the selected category fetched from URL.
			setSelectedCategory(initialCategory);
		}
	};

	useEffect(() => {
		let urlString = '';
		selectedCategory?.map((item, index) => {
			if (item !== "All") {
			urlString = urlString + "&tag" + index + "=" + encodeURIComponent(item);}
		});
		let params= "?pageNum=" + activePage + "&countPerPage=" + selectedCountPerPage;

		if (!backClick) {
			window.history.pushState(null, null, params);
		}

		const newOffset = (activePage * selectedCountPerPage) % filterListItems?.length;
		setItemOffset(newOffset);

	   if (selectedCategory?.includes("FAQAccordionList")) {
	         setFaqState(true);
			 setAllActiveClass(false);
	         let catCheckBoxOnLoad = {...catCheckBox, ["FAQAccordionList"]: true }
	         setCatCheckBox(catCheckBoxOnLoad);
        } else {
            setFaqState(false);
            Object.keys(props?.tagsTitleMap).forEach(function (key) {
                if (selectedCategory?.includes(key)) {
                    const filterItems = artlicleListItems.filter(({ tagsTitleMap  }) =>
                        Object.keys(tagsTitleMap).some((tag) => selectedCategory.includes(tag))
                    );
                    setSelectedFilteredData(filterItems);
                    setAllActiveClass(false);
                }
            });
            if(selectedCategory?.length === 0 ){
                setSelectedFilteredData(artlicleListItems);
                setAllActiveClass(true);
            }
        }
		setBackClick(true);
	}, [itemOffset, selectedCountPerPage, activePage, JSON.stringify(selectedCategory)]);

    /**
     * Called when page number is updated in pagination component. Restsnew offset and active page and scrolls user to top of article list.
     * @param {Object} event - Pagination component event object.
     */
    const handlePageClick = (event) => {
	    setBackClick(false);
        const newOffset = (event.selected * selectedCountPerPage) % filterListItems?.length;
        setItemOffset(newOffset);
        setActivePage(event.selected);
        window.scrollTo({
            top: articleViewStart.current.offsetTop,
            behavior: 'smooth'
        });
        learningAndResourcesEvent('Internal Search: Search Executed Successful', currentSelectedCategory.value, event.selected + 1, selectedCountPerPage, filterListItems?.length, currentSelectedCategory.checked);
    };

    /**
     * Called when user clicks on items per page. It recalculates the offset, active page and offset value.
     * @param {Number} selectedItemPerPage - Selected item per page.
     * @param {Array} items - Article list which is rendered.
     */
    const changeItemsPerPage = (selectedItemPerPage, items) => {
	    setBackClick(false);
        // Updates setSelectedCountPerPage state with currect count per page value.
        setSelectedCountPerPage(selectedItemPerPage);
        const updatedItemOffset = itemOffset % items?.length;
        const updatedActivePage = updatedItemOffset / selectedItemPerPage;
        const updatedPageCount = Math.ceil(items?.length / selectedItemPerPage);
        let newActivePage;
        setItemOffset(updatedItemOffset);
        if (selectedItemPerPage > items?.length) {
            setActivePage(0);
            newActivePage = 0;
        } else {
            if (Math.ceil(updatedActivePage) === updatedPageCount) {
                setActivePage(Math.floor(updatedActivePage));
                newActivePage = Math.floor(updatedActivePage);
            } else {
                setActivePage(Math.ceil(updatedActivePage));
                newActivePage = Math.ceil(updatedActivePage);
            }
        }
        learningAndResourcesEvent('Internal Search: Search Executed Successful', currentSelectedCategory.value, newActivePage + 1, selectedItemPerPage, filterListItems?.length, currentSelectedCategory.checked);
    };

    /**
     * Renders items per page list DOM elments.
     * @returns Items per page list DOM elments.
     */
    const displayItemsPerPageCount = () => {
        return itemsPerPageCountArray.map((item, index) => {
            return (
                <li
                    key={index}
                    className={`pagerList__Item ${item === selectedCountPerPage ? "selected" : ""
                        }`}
                    onClick={() => changeItemsPerPage(item, filterListItems)}
                >
                    <a className="pagerList__ItemText" role="button">
                        {item}
                    </a>
                </li>
            );
        });
    };


    let checkBoxList = {};
    tagValues?.forEach((item) => {
        let key = Object.keys(item)?.[0];
        checkBoxList = {...checkBoxList, [key]: false }
    });
    const [catCheckBox, setCatCheckBox] = useState(checkBoxList);
    const [allActiveClass,setAllActiveClass] = useState(true)

    /**
     * Called when user toggles the article category checkbox.
     * @param {Object} e - Event object.
     */

    const handleOnChange = (e) => {
        setBackClick(false);
        const { value, checked } = e.target;
        let selectedOption, totalResults;
        // If user has checked the checkbox then the checkbox value is pushed to setSelectedCategory.
        if (checked) {
            selectedOption = selectedCategory;
            selectedCategory.push(value);
            dataLayerLearningFiltersEvent("Article List Filter: Filter Type", selectedCategory);
            setSelectedCategory(selectedOption);
           
        } /* Else the checkbox value is removed from setSelectedCategory. */ else {
            selectedOption = selectedCategory.filter((e) => e !== value);
            dataLayerLearningFiltersEvent("Article List Filter unselected: Filter Type", selectedCategory);
            setSelectedCategory(selectedOption);
        }

        const updatedItemOffset = 0;
        // If the user clicks on FAQAccordionList checkbox.
        if (selectedOption?.includes("FAQAccordionList")) {
            setFaqState(true);
  			setAllActiveClass(false);
            let categoryChkBox = {};
            tagValues?.forEach((field) => {
                let key = Object.keys(field)?.[0];
                categoryChkBox = {...categoryChkBox, [key]: (key ==='FAQAccordionList' && checked) ? true : false }
            });
            setCatCheckBox(categoryChkBox)

            if (!checked) {
                setSelectedFilteredData(artlicleListItems);
            }
            learningAndResourcesEvent('Internal Search: Search Executed Successful', faqname, '', '', faqData?.length, checked);
        } else {
            setFaqState(false);
            setCatCheckBox({...catCheckBox,[value]:checked})
            Object.keys(props?.tagsTitleMap).forEach(function (key) {
                // If a category is selected then appropriate cards are displayed and all states are reset.
                if (selectedOption?.includes(key)) {
                    const filterItems = artlicleListItems.filter(({ tagsTitleMap  }) =>
                        Object.keys(tagsTitleMap).some((tag) => selectedOption.includes(tag))
                    );
                    
                    totalResults = filterItems?.length;
                    setSelectedFilteredData(filterItems);
                    setAllActiveClass(false);
                }
            });
            // If no category is selected then all categories are displayed and all states are reset.
            if (selectedOption?.length === 0) {
                totalResults = artlicleListItems?.length;
                setSelectedFilteredData(artlicleListItems);
                setAllActiveClass(true);
            }

            let selectedCategoryStr = [];
            selectedOption?.forEach((selectedItem) => {
                selectedCategoryStr.push(tagTitle[selectedItem])
            })
            setCurrentSelectedCategory({checked: checked, value: selectedCategoryStr.toString()});
            learningAndResourcesEvent('Internal Search: Search Executed Successful', selectedCategoryStr.toString(), 1, selectedCountPerPage, totalResults, checked);
        }
        setFilterListItems(selectedFilteredData);
        setItemOffset(updatedItemOffset);
        // Update the active page to 1.
        setActivePage(0);
    };


    /**
     * Toggles the accordion.
     * @param {Number} id - Index of the element selected.
     */
    const handleToggle = (id) => {
        let selected = [];
        // Checks if active state contains the selected element. If yes then removes it from active state and collapses the accordion.
        if (activeAccordian?.includes(id) === true) {
            selected = activeAccordian?.filter((item) => item !== id);
        } else {
            /* If user has authored singleExpansion as true then replaces the selected array with the element as
                only one element is expanded at any time. */
            if (faqSingleExpansion) {
                selected = [id];
            } /* Else adds the element to the exisiting array and expands the selected element. */ else {
            selected = [...activeAccordian, id];
          }
        }
        // Sets setActiveAccordian state with selected array.
        setActiveAccordian(selected);
    };

    const handleArticleList=(index)=>{
        setShowArticleList(showArticleList === index ? null : index);
    }

    

    useEffect(()=>{
        let params= "?pageNum=" + activePage + "&countPerPage=" + selectedCountPerPage;
		if (!backClick) {
			window.history.pushState(null, null, params);
		}
        const newOffset = (activePage * selectedCountPerPage) % filterListItems?.length;
		setItemOffset(newOffset);
        setPagination(selectedCountPerPage, filterListItems, itemOffset);
    },[itemOffset, activePage]);

    const handleClickOutsideFilterList=(event)=>{
        if(!event.target.closest('.articleList__category')){
            setShowArticleList(false)
        }
    }
    useEffect(()=>{
        document.addEventListener('mousedown',handleClickOutsideFilterList);
        return ()=>{
            document.removeEventListener('mousedown',handleClickOutsideFilterList);
        }
    })

    useEffect(()=>{
        setUpdatedCat();
    }, []);
    
    const setUpdatedCat = (cat) => {
        const updatedCategory = selectedCategory.filter(val => val !== cat)
        setSelectedCategory(updatedCategory);
    }

    const removeCat = () => {
        if(selectedCategory.length <= 1) {
            clearAllRef.current.click();
        }else{
            setTimeout(()=>{
                applyCatRef.current.click();
            },100)            
        }
    }

    const handleActiveFilter = (item) => {        
        setUpdatedCat(item);
        removeCat();
    }

    const handleFilterArticleClearAll = () => {     
        console.log("handleFilterArticleClearAll----", handleFilterArticleClearAll)   
        let params = "?pageNum=" + activePage + "&countPerPage=" + selectedCountPerPage;
        console.log("cleared selected filters", selectedFilteredData, props?.articlesList, filterListItems)
        setFilterListItems(selectedFilteredData, props?.articlesList, filterListItems);
        window.history.pushState(null, null, params);   
        setSelectedCategory([]);
        setFilterListItems(props?.articlesList);
        setPagination(selectedCountPerPage, artlicleListItems, itemOffset);
        setTimeout(()=>{
            setActivePage(0);
        },100)
    }

    const handleFilterArticleApply = () => {
        setFilterListItems(selectedFilteredData);
        console.log("Apply slected filters",selectedFilteredData, props?.articlesList, filterListItems, tagValues, selectedCategory )
        const newOffset = (activePage * selectedCountPerPage) % filterListItems?.length;
        setItemOffset(newOffset);
        setPagination(selectedCountPerPage, selectedFilteredData, newOffset);
        setApplyShow(true);
    }

    return (
        <>
            <div className="articleList__container">
                <div className="articleList__title" ref={articleViewStart}>Filter articles</div>
                <p className="articleList__infoText">{constants.FILTER_ARTICLE_INFO_TIP}</p>
                <div className="articleList__wrapper">
                    <div className="articleList__sideBar">
                        <form>  
                        { console.log("Applied filters", tagValues)}
                            {tagValues &&
                                tagValues.map((item,index) => {
                                    const catTitle = Object.keys(item)?.[0];
                                    const itemValues = Object.values(item)?.[0];

                                    if (!itemValues) {
                                        return null;
                                    }

                                    const objectEntires = Object.entries(itemValues);
                                    const sortedObjectData = objectEntires.sort(([key1], [key2])=>{
                                        return key1.localeCompare(key2);
                                    });

                                   

                                    const listItems = sortedObjectData.map(([key, value]) => (
                                        <li key={key} className={(tagTitle[key] === 'All' && allActiveClass) ? 'AllActive' : ''}>
                                          <span className="activeClassName"></span>
                                        <input
                                            type="checkbox"
                                            id={key}
                                            name={key}
                                            value={key}
                                            checked={selectedCategory.includes(key)}
                                            onChange={(e) => handleOnChange(e)}
                                            disabled={key !== 'FAQAccordionList' ? catCheckBox?.FAQAccordionList ? true : false : false}
                                        />
                                        <label htmlFor={key} className="label">
                                            {tagTitle[key]}
                                            {/* {
                                                value > 0 ? ( <span>({value})</span> ) : ('')
                                            } */}
                                        </label>
                                    </li>
                                    ));

                                    return (
                                        <div key={catTitle}>
                                            <div className="articleList__sideTitle">{catTitle}</div>
                                            <div className="articleList__dropdownWrapper">
                                            <div className='articleList__dropdown' onClick={()=>handleArticleList(index)}>
                                                Select One
                                            <span> <DropdownArrow/> </span>
                                            </div>
                                           
                                           {showArticleList === index && <ul className="articleList__category">{listItems}</ul>}
                                            </div>
                                        </div>
                                    );        
                                })
                            }

                                {faqname && Object.keys(props?.faqList?.[0]?.responsiveGrid?.[':items']).length > 0 &&
                                    (
                                        <>
                                            <div className="articleList__sideTitle">{faqname}</div>
                                            <ul className="articleList__category">
                                                <li key={55} className={('FAQAccordionList' === 'All' && allActiveClass) ? 'AllActive' : ''}>
                                                    <input
                                                        type="checkbox"
                                                        id={'FAQAccordionList'}
                                                        name={'FAQAccordionList'}
                                                        value={'FAQAccordionList'}
                                                        checked={selectedCategory.includes('FAQAccordionList')}
                                                        onChange={(e) => handleOnChange(e)}
                                                        disabled={'FAQAccordionList' !== 'FAQAccordionList' ? catCheckBox?.FAQAccordionList ? true : false : false}
                                                    />
                                                    <label htmlFor={'FAQAccordionList'} className="label">
                                                        {faqname}
                                                    </label>
                                                </li>
                                            </ul>
                                        </>
                                    )
                                }
                        </form >
                        <div className="articleList__dropdownActions">
                            <a ref={clearAllRef} onClick={()=>handleFilterArticleClearAll()}>Clear All</a>

                            {/* onClick={() => {
                                    if (article.url && article.fieldLabel) {
                                        dataLayerLearningArticleEvent("CardArticle: Card Article is available", article.url, article.fieldLabel);
                                    } else {
                                        dataLayerLearningArticleEvent("CardArticle: Card Article is not available");
                                    }
                                }} */}
                            <button ref={applyCatRef} disabled={selectedCategory.length > 0 ? false : true} className="btn-primary" onClick={handleFilterArticleApply}>Apply</button>
                        </div>
                        {applyShow &&
                            <div className="articleList__activeFilters">
                                <ul>
                                    {selectedCategory.length > 0 && <li>Active Filters</li>}
                                    {
                                        selectedCategory.map((item => {

                                        let activeFilterLabel;
                                        if( item in tagTitle){
                                            activeFilterLabel= tagTitle[item]
                                        }

                                        let activeFilterTitle;
                                        let ItemTitle= item.split('/')[0];
                                        if(ItemTitle in tagTitle){
                                            activeFilterTitle=tagTitle[ItemTitle]
                                        }

                                        return (
                                                <li>
                                                    <span className="activeFilterTitle">{activeFilterTitle} - {activeFilterLabel}</span>
                                                    <span className="activeFilterCrossIcon" onClick={() => handleActiveFilter(item)}>{<FilterCross />}</span>
                                                </li>
                                            )
                                        }))
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                    {faqState ? (
                        <div className="articleList__faq">
                            <div
                                className="gw-text primary"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        props?.faqList?.[0]?.responsiveGrid?.[":items"]?.text?.text,
                                }}
                            />

                            <div className="accordion accordion__container">
                                {faqData?.map((item, i) => (
                                    <>
                                        <div
                                            className={`accordion__title ${activeAccordian?.includes(i) === true && "active"
                                                }`}
                                            onClick={() => handleToggle(i)}
                                        >
                                            {item["cq:panelTitle"]}
                                        </div>
                                        <div
                                            className={`accordion__content ${activeAccordian?.includes(i) === true ? "show" : "hide"
                                                }`}
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: item.text }} />
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <ArticlesList filterListItems={currentItems} btnTitle={props?.viewMoreBtnLabel} />
                    )}
                </div>
            </div>
            {faqState ? '' : (<div className="pager pager__Wrapper">
                <div className="pager__Container">
                    <div className="pager__Items">
                        <div className="pager__Section">
                        <div className="pager__counts">Displaying: <span className="pager__counts__value">{filterListItems.length <= displayValue ? filterListItems.length : displayValue} of {filterListItems.length}</span></div>
                            <ReactPaginate
                                nextLabel="Next"
                                containerClassName="pagerList"
                                pageClassName="pagerList__Item"
                                pageLinkClassName="pagerList__ItemText"
                                nextLinkClassName="pagerList__Item pagerList__ItemText"
                                previousLinkClassName="pagerList__Item pagerList__ItemText"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={1}
                                breakClassName="separator"
                                pageCount={pageCount}
                                previousLabel="Previous"
                                renderOnZeroPageCount={null}
                            />
                            {/* <span className="pager_footer_divider"></span> */}
                        </div>
                    </div>
                </div>
            </div>
            ) }

        </>
    );
};

export default MapTo("ECCHub/components/nextgen/articleList")(
    ArticleList,
    ArticleListConfig
);

[
    "ecc-hub:products/client-access-system",
    "ecc-hub:customer-type/channel-partner"
]

[
    {
        "Content Type": {
            "ecc-hub:document-type/faq": 2,
            "ecc-hub:document-type/product-tip": 4,
            "ecc-hub:document-type/article": 85,
            "ecc-hub:document-type/video": 36,
            "ecc-hub:document-type/quick-reference-guide": 6,
            "ecc-hub:document-type/faq0": 1,
            "ecc-hub:document-type/toolkit": 4
        }
    },
    {
        "Customer Type": {
            "ecc-hub:customer-type/provider": 108,
            "ecc-hub:customer-type/payer": 39,
            "ecc-hub:customer-type/channel-partner": 18,
            "ecc-hub:customer-type/vendor": 2
        }
    },
    {
        "Solution Area": {
            "ecc-hub:solution-area/accupost": 5,
            "ecc-hub:solution-area/vision": 29,
            "ecc-hub:solution-area/customer-care-hub": 3,
            "ecc-hub:solution-area/filezilla": 4
        }
    },
    {
        "Product": {
            "ecc-hub:products/customer-care-hub": 10,
            "ecc-hub:products/vision": 56,
            "ecc-hub:products/filezilla": 2,
            "ecc-hub:products/accupost": 15,
            "ecc-hub:products/revenue-performance-advisor": 1,
            "ecc-hub:products/client-access-system": 2
        }
    }
]

export const dataLayerLearningFiltersCapturingEvent = (event, selectedFilters)  => {
	window?.digitalData?.events?.push({
		"event" : event,
		"ActiveFilters" : [],
		"FiltersArticles" : [],
		"SelectedContentTypeFilters" : [],
		"SelectedCustomerTypeFilters" : [],
		"SelectedProductFilters" : [],
    });
}
